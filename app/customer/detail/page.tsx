"use client";

import CustomerDetail from "@/app/component/CustomerDetail";
import { Suspense } from "react";

export default function CustomerDetailPage() {
    return (<Suspense fallback={<div>加载中...</div>}>
        <CustomerDetail />
    </Suspense>
    );
}