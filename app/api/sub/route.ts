// 订阅转换 API - 类似 Sub Converter
// 通过 URL 参数传入订阅链接，直接返回 Mihomo 配置文件

import { NextRequest, NextResponse } from 'next/server';
import { ProxyParser } from '@/lib/proxy-parser';
import { MihomoConfigGenerator } from '@/lib/mihomo-config';

/**
 * 解析 base64 编码的订阅内容
 */
function decodeSubscription(content: string): string[] {
  try {
    // 尝试 base64 解码
    const decoded = Buffer.from(content, 'base64').toString('utf-8');
    // 按行分割并过滤空行
    return decoded.split('\n').filter(line => line.trim().length > 0);
  } catch {
    // 如果不是 base64，直接按行分割
    return content.split('\n').filter(line => line.trim().length > 0);
  }
}

/**
 * 获取订阅链接内容
 */
async function fetchSubscription(url: string): Promise<string[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'clash-verge/v1.3.8'
      }
    });

    if (!response.ok) {
      throw new Error(`获取订阅失败: ${response.status} ${response.statusText}`);
    }

    const content = await response.text();
    return decodeSubscription(content);
  } catch (error) {
    throw new Error(`获取订阅失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }
}

/**
 * GET: 订阅转换接口
 * 
 * 查询参数:
 * - url: 订阅链接 (必需)
 * - type: 配置类型 simple | full (可选，默认: full)
 * - mode: 路由模式 whitelist | blacklist (可选，默认: whitelist)
 * 
 * 示例:
 * /api/sub?url=https://example.com/sub
 * /api/sub?url=https://example.com/sub&type=simple&mode=blacklist
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // 获取订阅链接
    const subscriptionUrl = searchParams.get('url');
    if (!subscriptionUrl) {
      return NextResponse.json(
        { error: '缺少订阅链接参数 (url)' },
        { status: 400 }
      );
    }

    // 验证订阅链接格式
    try {
      new URL(subscriptionUrl);
    } catch {
      return NextResponse.json(
        { error: '无效的订阅链接格式' },
        { status: 400 }
      );
    }

    // 获取配置类型 (simple 或 full，默认为 full)
    const configType = searchParams.get('type') === 'simple' ? 'simple' : 'full';
    
    // 获取路由模式 (whitelist 或 blacklist，默认为 whitelist)
    const ruleMode = searchParams.get('mode') === 'blacklist' ? 'blacklist' : 'whitelist';

    // 开发环境日志
    if (process.env.NODE_ENV === 'development') {
      console.log(`📡 订阅转换请求: URL=${subscriptionUrl}, Type=${configType}, Mode=${ruleMode}`);
    }

    // 获取订阅内容
    const proxyLinks = await fetchSubscription(subscriptionUrl);
    
    if (proxyLinks.length === 0) {
      return NextResponse.json(
        { error: '订阅内容为空或格式不正确' },
        { status: 400 }
      );
    }

    // 解析代理节点
    const proxies = ProxyParser.parseMultipleProxies(proxyLinks);
    
    if (proxies.length === 0) {
      return NextResponse.json(
        { error: '没有找到有效的代理节点，请检查订阅内容' },
        { status: 400 }
      );
    }

    // 生成配置
    const config = configType === 'simple' 
      ? MihomoConfigGenerator.generateSimpleConfig(proxies, ruleMode)
      : MihomoConfigGenerator.generateConfig(proxies, ruleMode);

    // 转换为 YAML
    const yaml = MihomoConfigGenerator.configToYaml(config);

    // 开发环境日志
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ 订阅转换成功: 解析了 ${proxies.length} 个节点`);
    }

    // 返回 YAML 配置文件
    return new NextResponse(yaml, {
      status: 200,
      headers: {
        'Content-Type': 'text/yaml; charset=utf-8',
        'Content-Disposition': 'attachment; filename="mihomo-config.yaml"',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    });

  } catch (error) {
    console.error('订阅转换失败:', error);
    
    return NextResponse.json(
      { 
        error: '订阅转换失败',
        details: error instanceof Error ? error.message : '服务器内部错误'
      },
      { status: 500 }
    );
  }
}

