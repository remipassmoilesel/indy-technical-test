
if (require.main === module) {
  main()
}

function main (): void {
  console.log('Hello !')
  throw new Error('Hey hey does source map works ?')
}

export function impressMe (a: number, b: number): number {
  return a + b
}
