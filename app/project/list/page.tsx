'use client'

import BackButton from "@/app/component/BackButton";
import ProjectList from "@/app/component/ProjectList";

export default function ProjectListPage() {
    return (
        <div>
            <div>
                <BackButton></BackButton>
            </div>
            <div>
                <ProjectList></ProjectList>
            </div>;
        </div>
    );

}