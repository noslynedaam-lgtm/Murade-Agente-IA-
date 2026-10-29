import assert from 'node:assert/strict';
import test from 'node:test';
import { duracaoContaPropria, ehCelularUA } from './acesso';

const req = (ua: string, cookie = '') => ({ header: (n: string) => (n.toLowerCase() === 'user-agent' ? ua : n.toLowerCase() === 'cookie' ? cookie : undefined) }) as never;
const IPHONE = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148 Safari/604.1';
const PC = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36 Edg/120.0';

test('celular: senha só na primeira vez (90 dias)', () => { assert.equal(duracaoContaPropria(req(IPHONE)), 90 * 24 * 3600); });
test('computador continua com 12 horas', () => { assert.equal(duracaoContaPropria(req(PC)), 12 * 3600); assert.equal(ehCelularUA(PC), false); });
test('celular com "pedir senha ao abrir" volta a 12 horas', () => { assert.equal(duracaoContaPropria(req(IPHONE, 'a=b; murade_exigir_senha=1')), 12 * 3600); });
