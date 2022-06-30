import cn from 'classnames';

export interface ButtonProps {
  className?: string;
  iconUrl?: string;
  onClick?: () => void;
}

export default function Button(props: React.PropsWithChildren<ButtonProps>) {
  const { className, iconUrl, children, onClick } = props;
  return (
    <button
      className={cn(
        className,
        'flex justify-center items-center gap-2 appearance-none border-black'
      )}
      onClick={onClick}
    >
      {!!iconUrl && <img className="w-6" src={iconUrl} alt="icon" />}
      <span>{children}</span>
    </button>
  );
}
