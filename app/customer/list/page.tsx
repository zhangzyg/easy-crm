'use client';

import BackButton from "@/app/component/BackButton";
import CreateButton from "@/app/component/CreateButton";
import CustomerList from "@/app/component/CustomerList";

export default function CustomerListPage() {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <BackButton></BackButton>
                <CreateButton createModule="创建用户"></CreateButton>
            </div>
            <div>
                <CustomerList></CustomerList>
            </div>
        </div>
    );
}



