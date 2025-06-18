'use client';

import ProjectDetail from "@/app/component/ProjectDetail";
import { Suspense } from "react";

export default function ProjectDetailPage() {
    return (<Suspense fallback={<div>加载中...</div>}>
        <ProjectDetail />
    </Suspense>);

}