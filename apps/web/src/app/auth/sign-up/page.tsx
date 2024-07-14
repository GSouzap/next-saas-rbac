import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import githubIcon from '@/assets/github-icon.svg'
import Image from "next/image";
import { SignUpForm } from "./sign-up-form";

export default function SignUpPage() {
  return (
    <SignUpForm />
  )
}