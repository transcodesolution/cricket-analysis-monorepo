type TFilterValue = string | string[] | undefined;

export interface IFilterParams {
  [key: string]: TFilterValue;
}

export const updateUrlParams = (filters: IFilterParams): string => {
  const currentUrl = new URL(window.location.href);
  const searchParams = new URLSearchParams(currentUrl.search);

  Object.entries(filters).forEach(([key, value]) => {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      searchParams.delete(key);
      return;
    }

    if (Array.isArray(value)) {
      searchParams.delete(key);
      value.forEach(val => searchParams.append(key, val));
    } else {
      searchParams.set(key, value);
    }
  });

  return `?${searchParams.toString()}`;
};