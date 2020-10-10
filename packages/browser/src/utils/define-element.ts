/**
 * Based on https://github.com/tc39/proposal-decorators#defineelement
 */
export function defineElement(name: string, options?: ElementDefinitionOptions) {
  return (klass: any) => {
    customElements.define(name, klass, options);
    return klass;
  };
}
