import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CookieService } from 'ngx-cookie-service';
import z from "zod";
import { environment } from "../../../environments/environment";


const LoginSchema = z.strictObject({
	email: z.email({ error: "올바른 이메일을 입력하세요" }),
	password: z.string().trim().min(8, "8자리 이상 비밀번호를 입력하세요")
});

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrl: './login.component.css',
	providers: [CookieService]
})
export class LoginPage implements OnInit {
	public email: string = "";
	public password: string = "";
	params: any;

	constructor(
		private cookieService: CookieService,
		private router: Router,
		private route: ActivatedRoute,
	) {
	}

	ngOnInit(): void {
		this.route.queryParams.subscribe(params => {
			this.params = params;
			console.log(this.params);
		});
	}

	register = () => {
		this.router.navigateByUrl("/register");
	}

	login = async () => {
		const formData = {
			email: this.email,
			password: this.password
		}
		const result = LoginSchema.safeParse(formData);

		if (!result.success) {
			alert(result?.error?.issues[0]?.message);
			return;
		}

		const response = await fetch(
			`${environment["API_HOST"]}/auth/signIn`,
			{
				method: "POST",
				headers: {
					"Content-type": "application/json"
				},
				body: JSON.stringify({
					email: this.email,
					password: this.password
				})
			}
		)

		const json = await response.json();

		if (json?.code === "0000") {
			if (json?.data?.accessToken) {
				this.cookieService.set("x-access-token", json?.data?.accessToken, { path: "/" });
				const from = this.params.from;
				this.router.navigateByUrl(from);
			}
			else {
				alert("다시 시도해주세요");
			}
		}
		else {
			alert(json?.message);
		}
	}

	setEmail = (e: any) => {
		this.email = e?.target?.value;
	}

	setPassword = (e: any) => {
		this.password = e?.target?.value;
	}

	keyup = (e: any) => {
		if (e.keyCode === 13) {
			this.login()
		}
	}
}