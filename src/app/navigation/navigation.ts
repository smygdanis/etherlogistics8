import { FuseNavigation } from "@fuse/types";

export const navigation: FuseNavigation[] = [
    {
        id: "applications",
        title: "Applications",
        translate: "NAV.APPLICATIONS",
        type: "group",
        children: [
            {
                id: "sample",
                title: "Dashboard",
                translate: "NAV.SAMPLE.TITLE",
                type: "item",
                icon: "dashboard",
                url: "/sample-dashboard",
                badge: {
                    title: "25",
                    translate: "NAV.SAMPLE.BADGE",
                    bg: "#F44336",
                    fg: "#FFFFFF"
                }
            },
            {
                id: "contacts",
                title: "Contacts",
                translate: "NAV.CONTACTS.TITLE",
                type: "item",
                icon: "supervisor_account",
                url: "/contacts"
            },
            {
                id: "calendar",
                title: "Calendar",
                translate: "NAV.CALENDAR.TITLE",
                type: "item",
                icon: "today",
                url: "/calendar"
            },
            {
                id: "companies",
                title: "Companies",
                translate: "NAV.COMPANIES.TITLE",
                type: "item",
                icon: "business",
                url: "/companies"
            },
            {
                id: "offers",
                title: "Offers",
                translate: "NAV.OFFERS.TITLE",
                type: "item",
                icon: "local_offer",
                url: "/offers"
            },
            {
                id: "invoices",
                title: "Invoices",
                translate: "NAV.INVOICES.TITLE",
                type: "item",
                icon: "receipt",
                url: "/invoices"
            },
            {
                id: "revenues",
                title: "Revenues",
                translate: "NAV.REVENUES.TITLE",
                type: "item",
                icon: "euro_symbol",
                url: "/revenues"
            },
            {
                id: "contracts",
                title: "Contracts",
                translate: "NAV.CONTRACTS.TITLE",
                type: "item",
                icon: "cached",
                url: "/contracts"
            },
            {
                id: "payments",
                title: "Payments",
                translate: "NAV.PAYMENTS.TITLE",
                type: "item",
                icon: "payment",
                url: "/payments"
            },

            {
                id: "services",
                title: "services",
                translate: "NAV.SERVVICES.TITLE",
                type: "item",
                icon: "shop_two",
                url: "/services"
            },
            {
                id: "reports",
                title: "Reports",
                translate: "NAV.REPORTS.TITLE",
                type: "item",
                icon: "assessment",
                url: "/reports"
            },
            // {
            //     id       : 'testFunction',
            //     title    : 'testFunction',
            //     type     : 'item',
            //     icon     : 'feedback',
            //     function :  () => {
            //         console.log('test22');

            //     }
            // },

            {
                id: "knowledgebase",
                title: "Knowledge Base",
                translate: "NAV.KNOWLEDGE",
                type: "collapsable",
                icon: "import_contacts",
                badge: {
                    title: "3",
                    bg: "#039BE5",
                    fg: "#FFFFFF"
                },
                children: [
                    {
                        id: "wiki",
                        title: "Wiki",
                        translate: "NAV.WIKI.TITLE",
                        type: "item",
                        icon: "note",
                        url: "wiki"
                    },
                    {
                        id: "help",
                        title: "Help",
                        translate: "NAV.HELP.TITLE",
                        type: "item",
                        icon: "help",
                        url: "help"
                    },
                    {
                        id: "faq",
                        title: "FAQ",
                        translate: "NAV.FAQ.TITLE",
                        type: "item",
                        icon: "help_outline",
                        url: "live_help"
                    }
                ]
            },
            {
                id: "settings",
                title: "Settings",
                translate: "NAV.DASHBOARDS",
                type: "collapsable",
                icon: "settings",
                badge: {
                    title: "2",
                    bg: "#039BE5",
                    fg: "#FFFFFF"
                },
                children: [
                    {
                        id: "profile",
                        title: "Profile",
                        translate: "NAV.PROFILE.TITLE",
                        type: "item",
                        icon: "account_circle",
                        url: "profile"
                    },
                    {
                        id: "company",
                        title: "Company",
                        translate: "NAV.COMPANY.TITLE",
                        type: "item",
                        icon: "location_city",
                        url: "company"
                    }
                ]
            }
        ]
    }
];
