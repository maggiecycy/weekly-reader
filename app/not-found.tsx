export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <h1 className="text-2xl font-semibold">未找到该期周刊</h1>
      <p className="mt-2 text-muted">请检查期号，或返回首页浏览已同步内容。</p>
      <a
        href="/"
        className="mt-6 inline-block rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background"
      >
        返回首页
      </a>
    </div>
  );
}
