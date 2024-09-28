const titleText = `一起計劃，

    一同出發，

打造專屬你的完美旅程！`;

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <div className="p-[50px] overflow-auto hide-scroll-bar">
        <div className="w-[500px] bg-white rounded-2xl min-h-[680px] shadow-lg p-[50px] flex flex-col gap-5">
          {children}
        </div>
      </div>

      <div className="flex flex-col flex-1 py-[50px]">
        <div className="text-4xl font-extrabold text-primary mb-10">
          Tripping GO!
        </div>
        <div className="text-display-large whitespace-pre-wrap flex h-full items-center justify-center font-extrabold text-white">
          {titleText}
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
