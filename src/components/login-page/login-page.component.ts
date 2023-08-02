import { Component, OnInit } from '@angular/core';
import { AirbnbNodeService } from 'src/app/airbnb-node.service';

@Component({
    selector: 'login-page',
    templateUrl: './login-page.component.html',
    styleUrls: ['./login-page.component.scss']
})

export class AirbnbLogin implements OnInit {

    constructor(private airbnbServcie: AirbnbNodeService) { }
    deleteIcon = '../../assets/svgs/delete.svg';
    password: any;
    isCardNumberValid: boolean = true;
    cardNumber: any;
    isDateValid: boolean = true;
    isFutureDate: boolean = true;
    cvv: any;
    isMonthValid: boolean = true;
    isCvvValid: boolean = true;
    expireDate: any;
    selectedPaymentMethod: any;
    accountsAvaliable: any;
    isAccountAddClicked: boolean = false;
    email: any;
    isRegisterBtnClicked: boolean = false;
    isResetPasswordVisible: boolean = false;
    allRoles: any;
    rolesMasterData: any;
    roleIdSelected: any;
    phoneNo: any;
    name: any;
    loginSuccessful: boolean = false;
    isPasswordVisible: boolean = false;
    isGuest: boolean = false;
    isHost: boolean = false;
    isAdmin: boolean = false;
    id: any;
    isEditClickedForProfile: boolean = false;
    resetPasswordClicked: boolean = false;
    isPhoneNumberValid: boolean = true;
    accountsSectionClicked: boolean = false;
    originalRoleIdSelected: any;


    ngOnInit(): void {
        this.getRoles();
    }

    checkIsDisable() {
        return this.name != "" &&
            this.email != "" &&
            this.password != "" &&
            this.phoneNo != "" &&
            this.roleIdSelected != null;
    }

    deleteAccount(id: any) {
        this.airbnbServcie.deleteAccount(id).subscribe((res) => {
            if (res) {
                this.accountsAvaliable = [];
                this.getAccounts();
            }
        })
    }

    onClickRegister() {
        this.resetFields();
        this.isRegisterBtnClicked = true;

    }

    getRoles() {
        this.airbnbServcie.getRolesMasterData().subscribe((res) => {
            this.allRoles = res;
            this.rolesMasterData = res.filter((role: any) => role.roleTitle != 'Admin');
        })
    }

    OnSubmit() {
        let details = {
            name: this.name,
            password: this.password,
            email: this.email,
            phoneNumber: this.phoneNo
        }
        let collectionName = this.allRoles.find((p: any) => p._id == this.roleIdSelected).roleTitle + 's';
        let req = {
            details: details,
            collectionName: collectionName
        }
        this.airbnbServcie.insertNewUser(req).subscribe((res) => {
            if (res && res.acknowledged == true) {
                alert("User Added Successfully");
                this.resetFields();
                this.isRegisterBtnClicked = false;
            }
        })

    }

    OnEditCanceled() {
        this.isEditClickedForProfile = this.airbnbServcie.isEditClickedForProfile = false;

    }

    validatePhoneNumber(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        const phoneNumberPattern = /^[0-9]{10}$/;
        this.isPhoneNumberValid = phoneNumberPattern.test(inputValue);
    }


    resetFields() {
        this.name = "";
        this.email = "";
        this.password = "";
        this.phoneNo = "";
        this.roleIdSelected = null;
        this.isHost = this.isGuest = this.isAdmin = this.airbnbServcie.isGuest = this.airbnbServcie.isHost = this.airbnbServcie.isAdmin = false;
        this.isPasswordVisible = false;
        this.id = null;
        this.isEditClickedForProfile = this.airbnbServcie.isEditClickedForProfile = false;
        this.isAccountAddClicked = this.airbnbServcie.isAccountAddClicked = false;
        this.accountsSectionClicked = this.airbnbServcie.accountsSectionClicked = false;
        this.cardNumber = null;
        this.selectedPaymentMethod = null;
        this.cvv = null;
        this.expireDate = null;
    }

    onUpdateClicked() {
        let details = {
            name: this.name,
            password: this.password,
            email: this.email,
            phoneNumber: this.phoneNo
        }
        let req = {
            email: this.airbnbServcie.userEmail,
            details: details,
            id: this.airbnbServcie.userId,
            collectionName: 'Airbnb_' + this.allRoles.find((p: any) => p._id == this.roleIdSelected).roleTitle + 's'
        }

        if (this.roleIdSelected != this.originalRoleIdSelected) {
            let deleteReq = {
                id: this.airbnbServcie.userId,
                role: 'Airbnb_' + this.allRoles.find((p: any) => p._id == this.originalRoleIdSelected).roleTitle + 's'
            }
            this.airbnbServcie.deleteProfile(deleteReq).subscribe((res) => {
                if (res && res.deletedCount > 0) {
                    let req = {
                        details: details,
                        collectionName: 'Airbnb_' + this.allRoles.find((p: any) => p._id == this.roleIdSelected).roleTitle + 's'
                    }
                    this.airbnbServcie.insertNewUser(req).subscribe((res) => {
                        alert("Updated Successfully");
                        this.resetFields();
                        this.onLogoutClicked();
                    })
                }
            })
        }
        else {
            this.airbnbServcie.updateProfile(req).subscribe((res: any) => {
                alert("Updated Successfully");
                this.resetFields();
                this.onLogoutClicked();

            })
        }
    }

    onUpdateProfileClicked() {
        this.isAccountAddClicked = this.airbnbServcie.isAccountAddClicked = false;
        this.accountsSectionClicked = this.airbnbServcie.accountsSectionClicked = false;
        this.isEditClickedForProfile = this.airbnbServcie.isEditClickedForProfile = true;
    }

    onLogoutClicked() {
        this.isRegisterBtnClicked = false;
        this.loginSuccessful = false;
        this.resetFields();
    }

    onLoginClicked() {
        this.airbnbServcie.getUserDetails(this.email).subscribe((res) => {
            if (res && res.details != null && res.details.length > 0 && res.details[0].email == this.email) {
                if (this.password == res.details[0].password) {
                    this.airbnbServcie.userEmail = this.email;
                    this.loginSuccessful = this.airbnbServcie.isLoginSuccessful = true;
                    this.airbnbServcie.userId = this.id = res.details[0]._id;
                    this.name = this.airbnbServcie.userName = res.details[0].name;
                    this.originalRoleIdSelected = this.allRoles.find((c: any) => c.roleTitle == res.role)._id;
                    this.roleIdSelected = this.allRoles.find((c: any) => c.roleTitle == res.role)._id;
                    this.phoneNo = res.details[0].phoneNumber;
                    if (res.role == "Guest") {
                        this.airbnbServcie.isGuest = this.isGuest = true;
                    }
                    else if (res.role == "Host") {
                        this.airbnbServcie.isHost = this.isHost = true;
                    }
                    else if (res.role == "Admin") {
                        this.airbnbServcie.isAdmin = this.isAdmin = true;
                    }
                }
                else {
                    alert("Incorrect password, please enter correct password");
                }

            }
            else {
                alert("User not exist, please register");
            }
        })
    }

    togglePasswordVisibility(): void {
        this.isPasswordVisible = !this.isPasswordVisible;
    }

    toggleResetPasswordVisibility(): void {
        this.isResetPasswordVisible = !this.isResetPasswordVisible;
    }

    OnCancel() {

        this.isRegisterBtnClicked = false;
        this.resetFields();
    }

    returnBack() {
        this.resetPasswordClicked = !this.resetPasswordClicked;
        this.email = null;
        this.password = null;
    }

    resetClicked() {
        this.email = null;
        this.password = null;
        this.resetPasswordClicked = true;
    }

    resetSubmitted() {
        let details = {
            Password: this.password,
        }
        let req = {
            email: this.email,
            details: details
        }
        this.airbnbServcie.updatePassword(req).subscribe((res) => {
            if (res.matchedCount > 0 && res.modifiedCount > 0) {
                alert("Updated Successfully");
                this.resetFields();
                this.onLogoutClicked();
                this.resetPasswordClicked = false;
            }
            else {
                alert("No user found with the email provided to reset the password");
                this.resetFields();
                this.onLogoutClicked();
                this.resetPasswordClicked = false;
            }


        })
    }

    onUserAccountsNavigated() {
        this.isEditClickedForProfile = this.airbnbServcie.isEditClickedForProfile = false;
        this.accountsSectionClicked = this.airbnbServcie.accountsSectionClicked = true;
        this.getAccounts();
    }

    onAddNewAccountClicked() {
        this.cardNumber = null;
        this.selectedPaymentMethod = null;
        this.cvv = null;
        this.expireDate = null;
        this.isAccountAddClicked = this.airbnbServcie.isAccountAddClicked = true;
    }

    getAccounts() {
        this.airbnbServcie.getAccountsByUserId(this.airbnbServcie.userId).subscribe((res) => {
            this.accountsAvaliable = res;
            this.accountsAvaliable.forEach((acc: any) => {
                acc.modifiedCardNumber  = '************' + acc.cardNumber.substring(12);
            });
        })
    }

    addAccount() {
        let req = {
            "userId": this.airbnbServcie.userId,
            "balance": "5000",
            "isGuest": this.isGuest ? 1 : 0,
            "isHost": this.isHost ? 1 : 0,
            "isAdmin": this.isAdmin ? 1 : 0,
            "cardType": this.selectedPaymentMethod,
            "cardNumber": this.cardNumber
        }
        this.airbnbServcie.addAccount(req).subscribe((res) => {
            if (res.insertedId != null) {
                alert("Account Added Successfully");
                this.getAccounts();
                this.isAccountAddClicked = this.airbnbServcie.isAccountAddClicked = false;
            }
        })
    }

    reset() {
        this.accountsSectionClicked = !this.accountsSectionClicked;
        this.airbnbServcie.accountsSectionClicked = !this.airbnbServcie.accountsSectionClicked
    }

    resetAddAccount() {
        this.isAccountAddClicked = this.airbnbServcie.isAccountAddClicked = false;
    }

    validateCvv(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        const cvvPattern = /^[0-9]{3,4}$/;
        this.isCvvValid = cvvPattern.test(inputValue);
    }

    validateExpiryDate(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        const datePattern = /^\d{2}\/\d{2}$/;
        this.isDateValid = datePattern.test(inputValue);

        if (this.isDateValid) {
            const currentDate = new Date();
            const inputDateParts = inputValue.split('/');
            const inputMonth = Number(inputDateParts[0]);
            const inputYear = Number(inputDateParts[1]);
            const inputDate = new Date(2000 + inputYear, inputMonth - 1, 1);

            this.isMonthValid = inputMonth >= 1 && inputMonth <= 12;
            this.isFutureDate = inputDate > currentDate;
        }
    }

    validateCardNumber(event: Event) {
        const inputValue = (event.target as HTMLInputElement).value;
        const cardNumberPattern = /^[0-9]{16}$/;
        this.isCardNumberValid = cardNumberPattern.test(inputValue);
    }

    isResetDisable() {
        return !(this.email != null && this.password != null && this.email != undefined && this.password != undefined
            && this.email != "" && this.password != "")
            ;
    }

    isLoginDisable() {
        return !(this.email != null && this.password != null && this.email != undefined && this.password != undefined
            && this.email != "" && this.password != "")
            ;
    }



}
