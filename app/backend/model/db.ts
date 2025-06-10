export interface Customer {
    id: string;
    name: string;
    status_id: number;
    tag_id: number;
    region: string;
    coordinator: string;
    position: string;
    recommand_person: string;
    last_follow_up_time: Date;
    created_date: Date;

    status?: Status; 
    tag?: Tag;
}

export interface Tag {
    id: number;
    label: string;
    color: string;
}

export interface Status {
    id: number;
    label: string;
    color: string;
}

export interface Contact {
    id: string;
    name: string;
    mail: string;
    phone: string;
    customer_id: string;

    phones?: Array<string>;
    customer: Customer;
}

export interface Project {
    id: string;
    name: string;
    type_id: number;
    amount: number;
    paid: number;
    created_date: Date;
    status_id: number;
    customer_id: string;
    type?: ProjectType;
    status?: ProjectStatus;
    customer?: Customer;
    followUps?: Array<FollowUp>;
}

export interface ProjectType {
    id: number;
    label: string;
    color: string;
}

export interface ProjectStatus {
    id: number;
    label: string;
    color: string;
}

export interface FollowUp {
  id: string;
  stage: string;
  status_id: number;
  created_date: Date;
}

export interface CustomerFollowUp {
    id: string;
    content: string;
    created_time: Date;
}

export interface FollowUpStatus {
    id: number;
    label: string;
    color: string;
}