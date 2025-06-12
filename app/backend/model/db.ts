export interface Customer {
    //db
    id: string;
    name: string;
    status_id: number;
    tag_id: number;
    region: string;
    coordinator: string;
    position: string;
    recommand_person: string;
    created_date: Date;
    //dto
    last_follow_up_time?: Date;
    status?: Status; 
    tag?: Tag;
    projects?: Array<Project>;
    contacts?: Array<Contact>;
    followUps?: Array<CustomerFollowUp>;
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
    //db
    id: string;
    name: string;
    mail: string;
    phone: string;
    customer_id: string;
    //dto
    phones?: Array<string>;
    customer?: Customer;
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
    //dto
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
  content: string;
  status_id: number;
  created_date: Date;
  project_id: string;
  //dto
  project?: Project;
  followUpStatus?: FollowUpStatus;
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