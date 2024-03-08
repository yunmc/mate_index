// 请求响应参数（不包含data）
export interface Result {
    code: string;
    msg: string;
}

// 请求响应参数（包含data）
export interface ResultData<T = any> extends Result {
    data: T;
}

// 分页响应参数

export interface ResPage<T> {
    list: T[];
    pageNum: number;
    pageSize: number;
    total: number;
}

// 分页请求参数
export interface ReqPage {
    pageNum: number;
    pageSize: number;
}

// 文件上传模块
export namespace Upload {
    export interface ResFileUrl {
        fileUrl: string;
    }
}

// 登录模块
export namespace Login {
    export interface ReqLoginForm {
        code: string;
    }
    export interface ResLogin {
        access_token: string;
        code: string;
        userInfo: any;
    }
    export interface ResAuthButtons {
        [key: string]: string[];
    }
}

// 用户管理模块
export namespace User {
    export interface ReqUserParams extends ReqPage {
        username: string;
        gender: number;
        idCard: string;
        email: string;
        address: string;
        createTime: string[];
        status: number;
    }
    export interface ResUserList {
        [x: string]: any;
        id: string;
        username: string;
        gender: number;
        user: { detail: { age: number } };
        idCard: string;
        email: string;
        address: string;
        createTime: string;
        status: number;
        avatar: string;
        photo: any[];
        introduce_image: string;
        index_image: string;
        children?: ResUserList[];
    }
    export interface ResStatus {
        userLabel: string;
        userValue: number;
    }
    export interface ResGender {
        genderLabel: string;
        genderValue: number;
    }
    export interface ResDepartment {
        id: string;
        name: string;
        children?: ResDepartment[];
    }
    export interface ResRole {
        id: string;
        name: string;
        children?: ResDepartment[];
    }
}

export namespace App {
    export interface ResConfig extends ReqPage {
        client_type: string; // 客户端类型
        upgrade_content: string; // 更新信息
        upgrade_version: string; // 最新版本
        upgrade_type: string; // 更新类型
        version?: string;
    }

    export interface rechargeConfig extends ReqPage {
        amount: number | string;
        user_account: number | string;
        recharge_type: number | string; // 0 金币 1 会员
        remark: string; // 备注
    }
}
