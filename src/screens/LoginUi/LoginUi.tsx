import React from "react";
import Button from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

const LoginUi: React.FC = () => {
  return (
    <div className="bg-[#d9d9d9] flex flex-row justify-center w-full min-h-screen">
      <div className="bg-[#d9d9d9] w-full max-w-[1920px] h-[1080px] relative">
        {/* Header */}
        <header className="absolute w-full h-[67px] top-0 left-0 bg-[#44444c]">
          <nav>
            <div className="absolute w-[53px] top-5 left-8 [font-family:'Archivo',Helvetica] font-light text-white text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
              Help
            </div>
          </nav>
        </header>

        {/* Logo */}
        <img
          className="absolute w-[211px] h-[211px] top-[150px] left-1/2 -translate-x-1/2 object-cover"
          alt="KMTI logo"
          src="/kmti-logo-removebg-preview-1.png"
        />

        {/* Login Card */}
        <Card className="absolute w-[425px] h-[354px] top-[428px] left-1/2 -translate-x-1/2 bg-[#00000017] rounded-[15px] border-none shadow-none">
          <CardContent className="p-0">
            {/* Card Title */}
            <div className="absolute w-[76px] top-[35px] left-[175px] [font-family:'Archivo',Helvetica] font-medium text-black text-2xl tracking-[0] leading-[normal] whitespace-nowrap">
              USER
            </div>

            {/* Username Input */}
            <div className="absolute w-[370px] h-[55px] top-[105px] left-7">
              <Input
                className="h-[55px] bg-white rounded-[10px] pl-[13px] [font-family:'Archivo',Helvetica] font-light text-[#00000070] text-xl"
                placeholder="Username:"
              />
            </div>

            {/* Password Input */}
            <div className="absolute w-[370px] h-[55px] top-[190px] left-7">
              <Input
                type="password"
                className="h-[55px] bg-white rounded-[10px] pl-[13px] [font-family:'Archivo',Helvetica] font-light text-[#00000070] text-xl"
                placeholder="Password:"
              />
            </div>

            {/* Login Button */}
            <div className="absolute w-[130px] h-[45px] top-[276px] left-[149px]">
              <Button className="w-32 h-[45px] bg-black text-white rounded-[10px] [font-family:'Archivo',Helvetica] font-normal text-xl hover:bg-black/90">
                Login
              </Button>
            </div>

            {/* Reset Password Link */}
            <button className="absolute w-[86px] top-[330px] left-[170px] [font-family:'Archivo',Helvetica] font-light text-black text-xs tracking-[0] leading-[normal]">
              Reset password
            </button>
          </CardContent>
        </Card>

        {/* Administrator Login Link */}
        <button className="absolute w-[197px] top-[1020px] left-1/2 -translate-x-1/2 [font-family:'Archivo',Helvetica] font-light text-black text-xl tracking-[0] leading-[normal] whitespace-nowrap">
          Login as Administrator
        </button>
      </div>
    </div>
  );
};

export default LoginUi;
