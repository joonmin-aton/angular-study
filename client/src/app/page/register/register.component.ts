import { Component } from "@angular/core";
import { Location } from "@angular/common";
import z from "zod";
import { Router } from "@angular/router";
import { environment } from "../../../environments/environment";

const RegisterSchema = z.strictObject({
    email: z.email({ error: "올바른 이메일을 입력하세요" }),
    password: z.string().trim().min(8, "8자리 이상 비밀번호를 입력하세요"),
    passwordChk: z.string().min(8, "8자리 이상 비밀번호를 입력하세요"),
    userName: z.string().min(2, "이름을 2자리 이상 입력하세요"),
});

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterPage {
    public email: string = "";
    public password: string = "";
    public passwordChk: string = "";
    public userName: string = "";
    
    constructor(
        private location: Location,
        private router : Router
    ) {
    }

    back = () => {
        this.location.back();
    }

    register = async () => {
        const formData = {
            email: this.email,
            password: this.password,
            passwordChk: this.passwordChk,
            userName: this.userName
        }
        const result = RegisterSchema.safeParse(formData);

        if (!result.success) {
            alert(result?.error?.issues[0]?.message);
            return;
        }
        if (this.password !== this.passwordChk) {
            alert("두 개의 비밀번호가 맞지 않습니다.");
            return;
        }
        
        const response = await fetch(
            `${environment["API_HOST"]}/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({
                    email: this.email,
                    name: this.userName,
                    password: this.password
                })
            }
        )

        if (response.ok) {
            alert("회원가입에 성공하였습니다.");
            this.router.navigateByUrl("/login");
        }
        else {
            alert("회원가입에 실패했습니다.");
        }
    }

    setEmail = (e: any) => {
        this.email = e?.target?.value;
    }

    setPassword = (e: any) => {
        this.password = e?.target?.value;
    }

    setPasswordChk = (e: any) => {
        this.passwordChk = e?.target?.value;
    }

    setUserName = (e: any) => {
        this.userName = e?.target?.value;
    }
}