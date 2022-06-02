export const hashConfig = {
  timeCost: 4, //execution time / iterations
  memoryCost: 64000, //memory usage in KB
  parallelism: 2, // number of threads to use
  hashLength: 32, //  size of the derived key
  saltLength: 16, // size of the random generated salt
  //provides a balanced approach to resisting
  //both side-channel and GPU-based attacks.
  argon2id: true
}

// example hash output:
// const hash = await argon.hash(dto.password, { ...hashConfig })
//---Params: pass=password, salt=somesalt, time=4, mem=1024, hashLen=32, parallelism=2, type=2
//---Encoded: $argon2id$v=19$m=1024,t=1,p=1$c29tZXNhbHQ$yOmu3JVvan3/Ck1ClA32KGI/Mo6hI1AFq6yTPFcJPiM
//---Hash: c8e9aedc956f6a7dff0a4d42940df628623f328ea1235005abac933c57093e23
