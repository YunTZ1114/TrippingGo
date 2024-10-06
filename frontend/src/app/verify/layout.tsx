const getBackgroundImage = (imageUrl: string) =>
  `linear-gradient(0deg, var(--Miscellaneous-Bar-border, rgba(0, 0, 0, 0.50)) 0%, var(--Miscellaneous-Bar-border, rgba(0, 0, 0, 0.50)) 100%), url('${imageUrl}')`;

const VerifyLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div
      className="w-full h-screen bg-cover bg-right flex"
      style={{ backgroundImage: getBackgroundImage("/default-cover.jpeg") }}
    >
      <div className="hide-scrollbar flex h-full w-full justify-center overflow-auto p-[50px]">
        <div className="flex h-max w-[500px] flex-col items-center justify-center gap-10 rounded-2xl bg-white p-[50px] shadow-lg">
          {children}
        </div>
      </div>
    </div>
  );
};

export default VerifyLayout;
