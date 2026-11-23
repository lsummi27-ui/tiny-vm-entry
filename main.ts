import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
function run(p, q) {
  const D = new Int32Array(256), M = new Int32Array(256), C = new Int32Array(64), o = new Uint8Array(65536);
  let sp = 0, cp = 0, ol = 0, ip = 0, pc = 0, st = 0;
  const trap = (e) => ({ o: o.slice(0, ol), c: e });
  for (;;) {
    if (st === 1e6) return trap(10);
    if (pc < 0 || pc >= p.length) return trap(9);
    const b = p[pc];
    const ok = b <= 7 || (b >= 16 && b <= 30) || (b >= 32 && b <= 34) || (b >= 48 && b <= 52) || b === 64 || b === 65 || (b >= 80 && b <= 83);
    if (!ok) return trap(5);
    const im = b === 1 ? 1 : b === 2 ? 4 : b >= 48 && b <= 51 ? 2 : 0;
    if (pc + im >= p.length) return trap(9);
    st++;
    const nx = pc + 1 + im;
    const po = b === 7 ? 3 : b === 3 || b === 4 || b === 23 || b === 27 || b === 49 || b === 50 || b === 64 || b === 80 || b === 81 || b === 83 ? 1 : b === 5 || b === 6 || (b >= 16 && b <= 22) || (b >= 24 && b <= 26) || (b >= 28 && b <= 34) || b === 65 ? 2 : 0;
    const pu = b === 1 || b === 2 || b === 23 || b === 27 || (b >= 16 && b <= 34 && b !== 23 && b !== 27) || b === 64 || b === 82 ? 1 : b === 4 || b === 5 ? 2 : b === 6 || b === 7 ? 3 : 0;
    if (sp < po) return trap(2);
    if (sp - po + pu > 256) return trap(3);
    pc = nx;
    switch (b) {
      case 0: return { o: o.slice(0, ol), c: 0 };
      case 1: D[sp++] = (p[nx - 1] << 24) >> 24; break;
      case 2: D[sp++] = p[nx - 4] | (p[nx - 3] << 8) | (p[nx - 2] << 16) | (p[nx - 1] << 24); break;
      case 3: sp--; break;
      case 4: D[sp] = D[sp - 1]; sp++; break;
      case 5: { const t = D[sp - 1]; D[sp - 1] = D[sp - 2]; D[sp - 2] = t; break; }
      case 6: D[sp] = D[sp - 2]; sp++; break;
      case 7: { const a = D[sp - 3]; D[sp - 3] = D[sp - 2]; D[sp - 2] = D[sp - 1]; D[sp - 1] = a; break; }
      case 23: D[sp - 1] = -D[sp - 1] | 0; break;
      case 27: D[sp - 1] = ~D[sp - 1]; break;
      case 16: case 17: case 18: case 19: case 20: case 21: case 22: case 24: case 25: case 26: case 28: case 29: case 30: case 32: case 33: case 34: {
        const c = D[sp - 1], a = D[sp - 2];
        let r;
        if (b === 16) r = (a + c) | 0;
        else if (b === 17) r = (a - c) | 0;
        else if (b === 18) r = Math.imul(a, c);
        else if (b === 19) { if (c === 0) return trap(4); r = a === -2147483648 && c === -1 ? a : (a / c) | 0; }
        else if (b === 20) { if (c === 0) return trap(4); r = c === -1 ? 0 : (a % c) | 0; }
        else if (b === 21) { if (c === 0) return trap(4); r = Math.floor((a >>> 0) / (c >>> 0)) | 0; }
        else if (b === 22) { if (c === 0) return trap(4); r = ((a >>> 0) % (c >>> 0)) | 0; }
        else if (b === 24) r = a & c;
        else if (b === 25) r = a | c;
        else if (b === 26) r = a ^ c;
        else if (b === 28) r = a << (c & 31);
        else if (b === 29) r = a >> (c & 31);
        else if (b === 30) r = (a >>> (c & 31)) | 0;
        else if (b === 32) r = a === c ? 1 : 0;
        else if (b === 33) r = a < c ? 1 : 0;
        else r = (a >>> 0) < (c >>> 0) ? 1 : 0;
        sp -= 2; D[sp++] = r; break;
      }
      case 48: case 49: case 50: {
        const rel = ((p[nx - 2] | (p[nx - 1] << 8)) << 16) >> 16;
        let take = true;
        if (b !== 48) { const v = D[--sp]; take = b === 49 ? v === 0 : v !== 0; }
        if (take) pc = nx + rel;
        break;
      }
      case 51:
        if (cp === 64) return trap(7);
        C[cp++] = nx; pc = p[nx - 2] | (p[nx - 1] << 8); break;
      case 52:
        if (cp === 0) return trap(8);
        pc = C[--cp]; break;
      case 64: { const a = D[sp - 1]; if (a < 0 || a >= 256) return trap(6); D[sp - 1] = M[a]; break; }
      case 65: { const a = D[sp - 1], v = D[sp - 2]; if (a < 0 || a >= 256) return trap(6); sp -= 2; M[a] = v; break; }
      case 80: { const s = String(D[sp - 1]); if (ol + s.length > 65536) return trap(11); sp--; for (let i = 0; i < s.length; i++) o[ol++] = s.charCodeAt(i); break; }
      case 81:
        if (ol + 1 > 65536) return trap(11);
        o[ol++] = D[--sp] & 255; break;
      case 82: D[sp++] = ip < q.length ? q[ip++] : -1; break;
      case 83: return { o: o.slice(0, ol), c: D[--sp] & 255 };
    }
  }
}
const I = process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
for (const id of readdirSync(I).sort()) {
  const r = run(new Uint8Array(readFileSync(join(I, id, 'program.bin'))), new Uint8Array(readFileSync(join(I, id, 'input.bin'))));
  mkdirSync(join(O, id), { recursive: true });
  writeFileSync(join(O, id, 'stdout.bin'), r.o);
  writeFileSync(join(O, id, 'exit.txt'), `${r.c}\n`);
}
