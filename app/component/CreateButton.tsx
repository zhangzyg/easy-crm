import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function CreateButton({ createModule }: { createModule: string }) {

    const router = useRouter();

    function onClickCustomerDetail(mode: string, createModule: string) {
        if (createModule === '创建用户') {
            router.push('/customer/detail');
        }
    }

    return <Button onClick={() => onClickCustomerDetail('init', createModule)}>{createModule}</Button>
}

