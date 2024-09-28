const getBackgroundImage = (imageUrl: string) =>
  `linear-gradient(0deg, var(--Miscellaneous-Bar-border, rgba(0, 0, 0, 0.50)) 0%, var(--Miscellaneous-Bar-border, rgba(0, 0, 0, 0.50)) 100%), url('${imageUrl}')`;

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div
      className="w-full h-screen bg-cover bg-right flex"
      style={{ backgroundImage: getBackgroundImage("/default-cover.jpeg") }}
    >
      {children}
    </div>
  );
};

export default AuthLayout;
