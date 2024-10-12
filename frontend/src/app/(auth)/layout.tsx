const getBackgroundImage = (imageUrl: string) =>
  `linear-gradient(0deg, var(--Miscellaneous-Bar-border, rgba(0, 0, 0, 0.50)) 0%, var(--Miscellaneous-Bar-border, rgba(0, 0, 0, 0.50)) 100%), url('${imageUrl}')`;

const titleText = `一起計劃，

    一同出發，

打造專屬你的完美旅程！`;

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div
      className="flex h-screen w-full bg-cover bg-right"
      style={{ backgroundImage: getBackgroundImage("/default-cover.jpeg") }}
    >
      <div className="hide-scroll-bar overflow-auto p-[50px]">
        <div className="flex min-h-[680px] w-[500px] flex-col gap-5 rounded-2xl bg-white p-[50px] shadow-lg">
          {children}
        </div>
      </div>

      <div className="flex flex-1 flex-col py-[50px]">
        <div className="mb-10 text-4xl font-extrabold text-primary">
          Tripping GO!
        </div>
        <div className="flex h-full items-center justify-center whitespace-pre-wrap text-display-large font-extrabold text-white">
          {titleText}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
