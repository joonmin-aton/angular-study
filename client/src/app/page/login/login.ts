import { Component } from "@angular/core";
import { Location } from "@angular/common";
import z from "zod";

const LoginSchema = z.strictObject({
    email: z.email({ error: "올바른 이메일을 입력하세요" }),
    password: z.string().trim().min(8, "8자리 이상 비밀번호를 입력하세요")
});

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginPage {
    public email: string = "";
    public password: string = "";

    constructor(private location: Location) {}

    register = () => {
        window.location.href = "/register";
    }

    login = () => {
        const formData = {
            email: this.email,
            password: this.password
        }
        const result = LoginSchema.safeParse(formData);

        if (!result.success) {
            alert(result?.error?.issues[0]?.message);
            return;
        }
    }

    setEmail = (e: any) => {
        this.email = e?.target?.value;
    }

    setPassword = (e: any) => {
        this.password = e?.target?.value;
    }
}