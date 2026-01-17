import React from "react";

type NextLinkProps = React.PropsWithChildren<{
  href: string;
  className?: string;
  prefetch?: boolean;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}> &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "className" | "onClick">;

const Link = ({ href, children, className, onClick, ...rest }: NextLinkProps) => {
  return (
    <a href={href} className={className} onClick={onClick} {...rest}>
      {children}
    </a>
  );
};

export default Link;
