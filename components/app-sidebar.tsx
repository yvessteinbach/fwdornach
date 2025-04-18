"use client"

import * as React from "react"
import Link from "next/link"
import {
  Siren,
  FireExtinguisher,
  LifeBuoy,
  Send,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from "next/image"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Einsatz",
      url: "",
      icon: Siren,
      isActive: true,
      items: [
        {
          title: "Alle Einsätze",
          url: "/dashboard/einsatz",
        },
        {
          title: "Einsatz erstellen",
          url: "/dashboard/einsatz/erstellen",
        },
        {
          title: "Statistiken",
          url: "/dashboard/einsatz/statistik",
        },
      ],
    },
    {
      title: "Übungen",
      url: "#",
      icon: FireExtinguisher,
      items: [
        {
          title: "Alle Übungen",
          url: "/dashboard/uebung",
        },
        {
          title: "Übung erstellen",
          url: "/dashboard/uebung/erstellen",
        },
        {
          title: "Statistiken",
          url: "/dashboard/uebung/statistik",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Support",
      url: "#",
      icon: LifeBuoy,
    },
    {
      title: "Feedback",
      url: "#",
      icon: Send,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="items-center justify-center rounded-lg">
                  <Image
                    src="/Logo.png"
                    alt="Logo"
                    width={26}
                    height={32}
                  />                
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Social Media Tool</span>
                  <span className="truncate text-xs">Feuerwehr Dornach</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
