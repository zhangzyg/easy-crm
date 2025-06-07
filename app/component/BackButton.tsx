'use client'

import { useRouter } from 'next/navigation';
import { LeftOutlined } from '@ant-design/icons';

export default function BackButton() {
    const router = useRouter()
    return (
        <LeftOutlined style={{ fontSize: '20px' }} onClick={() => router.back()} />
    );
}

