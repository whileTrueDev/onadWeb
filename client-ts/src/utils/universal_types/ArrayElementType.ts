export type ArrayElementType < T extends ReadonlyArray < unknown > > = T extends ReadonlyArray<
infer ArrayElementType
> ? ArrayElementType : never;
