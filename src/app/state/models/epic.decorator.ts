export function Epic(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    target['epics'] = [...(target['epics'] || []), descriptor.value];
}
