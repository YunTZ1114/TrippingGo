export const classNames = (
  ...className: (string | null | undefined | false)[]
) => className.flatMap((data) => (data ? [data] : [])).join(" ");
