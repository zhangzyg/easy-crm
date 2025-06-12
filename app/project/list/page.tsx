'use client'

import BackButton from "@/app/component/BackButton";
import ProjectList from "@/app/component/ProjectList";

export default function ProjectListPage() {
    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <BackButton></BackButton>
                <div style={{ display: 'flex', gap: 16 }}>
                    <span style={{color: 'green'}}>项目总跟进额: 1000$</span>
                    <span>项目总额: 1000$</span>
                </div>
                
            </div>
            <div>
                <ProjectList></ProjectList>
            </div>;
        </div>
    );

}