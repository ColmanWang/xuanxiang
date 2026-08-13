import type { Metadata } from "next";
import "./globals.css";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResearchModeProvider } from "@/components/research/research-mode-provider";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "玄象 | 中国传统思想与术数知识库",
    template: "%s | 玄象",
  },
  description:
    "探索易学、阴阳五行、道家思想、传统术数与中国宇宙观，通过知识图谱连接经典、人物、体系与历史。",
  keywords: [
    "中国传统思想",
    "易学",
    "术数",
    "道家",
    "传统文化",
    "知识图谱",
    "数字典藏",
  ],
  applicationName: "玄象",
  category: "传统文化知识库",
};

const designContract = `
<!--
THESIS: 玄象是一张可研究的中国传统认知网络；拒绝国风模板与卡片堆叠。
OWN-WORLD: 暖矿物白、碳墨与深青；编目细线、坐标节点、索引表和少量朱砂定位标记。
STORY: 先理解品牌与知识入口，再观察思想演化，最后沿图谱进入知识库或推演系统。
FIRST VIEWPORT: 左侧巨幅“玄象”与品牌说明，右侧方形关系坐标场；双主行动位于说明下方。
FORM: 数字典藏修复台，候选方向第 3，seed 5efd02de；批准稿 .impeccable/mocks/home-option-c-approved.png。
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
-->
`;

const researchModeBootstrap = `
try {
  const value = localStorage.getItem("xuanxiang:view-mode:v1");
  document.documentElement.dataset.viewMode = value === "research" ? "research" : "browse";
} catch { document.documentElement.dataset.viewMode = "browse"; }
`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: researchModeBootstrap }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <template
          id="xuanxiang-design-contract"
          dangerouslySetInnerHTML={{ __html: designContract }}
        />
        <ThemeProvider>
          <ResearchModeProvider>
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </ResearchModeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
