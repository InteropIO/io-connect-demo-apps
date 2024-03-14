/*
const mulberry32Gen = (a:number):()=>number => {
  return function() {
    a += 0x6D2B79F5; a >>>= 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0)
  }
}
*/

const stringHash = (str: string, seed = 0): number =>{
  let h1 = 0xdeadbeef ^ seed,
      h2 = 0x41c6ce57 ^ seed;
  let i: number, ch: number;
  for (i = 0; i < str.length; i++) {
      ch = str.charCodeAt(i);
      h1 = Math.imul(h1 ^ ch, 2654435761);
      h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 =
      Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^
      Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 =
      Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^
      Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

abstract class PRNG {
  abstract next32():number
  //abstract next32Range(from:number, to:number, includeTo?:boolean):number
  public next32Range(from:number, to:number, includeTo = true):number {
    const val = this.next32()
    const included = includeTo ? 1 : 0
    return val % (to-from+included) + from
  }
}

class PRNG_sfc32 extends PRNG {
  // state
  private s1 = 0x01234567
  private s2 = 0x89ABCDEF
  private s3 = 0xFEDCBA98
  private s4 = 0x76543210
  constructor (s1?:string|Date|number, s2?:number, s3?:number, s4?:number) {
      super()
      if (s1 instanceof Date) {
        s1 = s1.toISOString().split('T')[0]
      }
      if (typeof(s1) === "string") {
        this.s1 = stringHash(s1, this.s1)
        this.s2 = stringHash(s1, this.s2)
        this.s3 = stringHash(s1, this.s3)
        this.s4 = stringHash(s1, this.s4)
        return
      }
      this.s1 = (s1 != null) ? s1>>>0 : this.s3
      this.s2 = (s2 != null) ? s2>>>0 : this.s2
      this.s3 = (s3 != null) ? s3>>>0 : this.s3
      this.s4 = (s4 != null) ? s4>>>0 : this.s4
  }

  public next32():number {
    this.s1 >>>= 0; this.s2 >>>= 0; this.s3 >>>= 0; this.s4 >>>= 0; 
    let t = (this.s1 + this.s2) | 0;
    this.s1 = this.s2 ^ (this.s2 >>> 9);
    this.s2 = this.s3 + (this.s3 << 3) | 0;
    this.s3 = ((this.s3 << 21) | (this.s3 >>> 11));
    this.s4 = this.s4 + 1 | 0;
    t = t + this.s4 | 0;
    this.s3 = this.s3 + t | 0;
    return (t >>> 0);
  }
}

export {
  PRNG,
  PRNG_sfc32
}