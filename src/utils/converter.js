import yaml from 'js-yaml';

// Helper to decode Base64 safely
const safeBase64Decode = (str) => {
  try {
    // Fix padding if necessary
    let padded = str;
    if (str.length % 4 !== 0) {
      padded += '='.repeat(4 - (str.length % 4));
    }
    return decodeURIComponent(escape(atob(padded)));
  } catch (e) {
    console.error('Base64 decode error:', e);
    return '';
  }
};

// Parse vmess link
const parseVmess = (link) => {
  try {
    const base64 = link.replace('vmess://', '');
    const config = JSON.parse(safeBase64Decode(base64));
    return {
      name: config.ps || 'vmess',
      type: 'vmess',
      server: config.add,
      port: parseInt(config.port),
      uuid: config.id,
      alterId: parseInt(config.aid || 0),
      cipher: config.scy || 'auto',
      tls: config.tls === 'tls',
      servername: config.sni || '',
      network: config.net || 'tcp',
      'ws-opts': config.net === 'ws' ? {
        path: config.path || '/',
        headers: config.host ? { Host: config.host } : {}
      } : undefined,
    };
  } catch (e) {
    console.error('Error parsing vmess:', e);
    return null;
  }
};

// Parse vless link
const parseVless = (link) => {
  try {
    const url = new URL(link);
    const params = new URLSearchParams(url.search);
    return {
      name: decodeURIComponent(url.hash.slice(1)) || 'vless',
      type: 'vless',
      server: url.hostname,
      port: parseInt(url.port),
      uuid: url.username,
      cipher: 'auto',
      tls: params.get('security') === 'tls',
      'flow': params.get('flow') || '',
      servername: params.get('sni') || '',
      network: params.get('type') || 'tcp',
      'ws-opts': params.get('type') === 'ws' ? {
        path: params.get('path') || '/',
        headers: params.get('host') ? { Host: params.get('host') } : {}
      } : undefined,
       'reality-opts': params.get('security') === 'reality' ? {
          'public-key': params.get('pbk') || '',
          'short-id': params.get('sid') || '',
      } : undefined,
      'client-fingerprint': params.get('fp') || '',
    };
  } catch (e) {
    console.error('Error parsing vless:', e);
    return null;
  }
};

// Parse trojan link
const parseTrojan = (link) => {
  try {
    const url = new URL(link);
    const params = new URLSearchParams(url.search);
    return {
      name: decodeURIComponent(url.hash.slice(1)) || 'trojan',
      type: 'trojan',
      server: url.hostname,
      port: parseInt(url.port),
      password: url.username,
      sni: params.get('sni') || '',
      network: params.get('type') || 'tcp',
      'ws-opts': params.get('type') === 'ws' ? {
        path: params.get('path') || '/',
        headers: params.get('host') ? { Host: params.get('host') } : {}
      } : undefined,
      udp: true,
    };
  } catch (e) {
    console.error('Error parsing trojan:', e);
    return null;
  }
};

// Parse ss link
const parseSS = (link) => {
  try {
    let raw = link.replace('ss://', '');
    let name = '';
    if (raw.includes('#')) {
      const parts = raw.split('#');
      raw = parts[0];
      name = decodeURIComponent(parts[1]);
    }
    
    let decoded = safeBase64Decode(raw);
    let method, password, server, port;

    if (decoded.includes('@')) {
        const parts = decoded.split('@');
        const userInfo = parts[0].split(':');
        method = userInfo[0];
        password = userInfo[1];
        const serverInfo = parts[1].split(':');
        server = serverInfo[0];
        port = parseInt(serverInfo[1]);
    } else {
        return null; 
    }

    return {
      name: name || 'ss',
      type: 'ss',
      server: server,
      port: port,
      cipher: method,
      password: password,
    };
  } catch (e) {
    console.error('Error parsing ss:', e);
    return null;
  }
};

// Parse tuic link
const parseTuic = (link) => {
  try {
    const url = new URL(link);
    const params = new URLSearchParams(url.search);
    return {
      name: decodeURIComponent(url.hash.slice(1)) || 'tuic',
      type: 'tuic',
      server: url.hostname,
      port: parseInt(url.port),
      uuid: url.username,
      password: url.password,
      'congestion-controller': params.get('congestion_control') || 'bbr',
      'udp-relay-mode': params.get('udp_relay_mode') || 'native',
      'reduce-rtt': true,
      heartbeat: '10s',
      sni: params.get('sni') || '',
      'alpn': params.get('alpn') ? params.get('alpn').split(',') : undefined,
      'disable-sni': params.get('disable_sni') === '1',
    };
  } catch (e) {
    console.error('Error parsing tuic:', e);
    return null;
  }
};

// Parse hysteria2 link
const parseHysteria2 = (link) => {
  try {
    const url = new URL(link);
    const params = new URLSearchParams(url.search);
    return {
      name: decodeURIComponent(url.hash.slice(1)) || 'hysteria2',
      type: 'hysteria2',
      server: url.hostname,
      port: parseInt(url.port),
      password: url.username || url.password,
      sni: params.get('sni') || '',
      'skip-cert-verify': params.get('insecure') === '1',
      obfs: params.get('obfs') || '',
      'obfs-password': params.get('obfs-password') || '',
      alpn: params.get('alpn') ? params.get('alpn').split(',') : undefined,
    };
  } catch (e) {
    console.error('Error parsing hysteria2:', e);
    return null;
  }
};

export const parseLinks = (text) => {
  const lines = text.split(/[\r\n]+/);
  const proxies = [];
  const nameCount = {};

  lines.forEach(line => {
    line = line.trim();
    if (!line) return;
    
    let proxy = null;
    if (line.startsWith('vmess://')) {
      proxy = parseVmess(line);
    } else if (line.startsWith('vless://')) {
      proxy = parseVless(line);
    } else if (line.startsWith('trojan://')) {
      proxy = parseTrojan(line);
    } else if (line.startsWith('ss://')) {
      proxy = parseSS(line);
    } else if (line.startsWith('tuic://')) {
      proxy = parseTuic(line);
    } else if (line.startsWith('hysteria2://') || line.startsWith('hy2://')) {
      proxy = parseHysteria2(line);
    }
    
    if (proxy) {
      let name = proxy.name;
      if (nameCount[name]) {
        nameCount[name]++;
        proxy.name = `${name}_${nameCount[name]}`;
      } else {
        nameCount[name] = 1;
      }
      proxies.push(proxy);
    }
  });
  
  return proxies;
};

export const generateClashConfig = (proxies) => {
  const config = {
    proxies: proxies,
    'proxy-groups': [
      {
        name: 'Select',
        type: 'select',
        proxies: proxies.map(p => p.name).concat(['DIRECT', 'REJECT'])
      },
       {
        name: 'Auto',
        type: 'url-test',
        url: 'http://www.gstatic.com/generate_204',
        interval: 300,
        proxies: proxies.map(p => p.name)
      }
    ],
    rules: [
      'MATCH,Select'
    ]
  };
  
  return yaml.dump(config);
};
