'use client'
const Footer = () => {
    const footerNavs = [
        {
            label: "Resources",
            items: [
                { href: 'javascript:void(0)', name: 'Contact' },
                { href: 'javascript:void(0)', name: 'Support' },
                { href: 'javascript:void(0)', name: 'Documentation' },
                { href: 'javascript:void(0)', name: 'Pricing' },
            ],
        },
        {
            label: "About",
            items: [
                { href: 'javascript:void(0)', name: 'Terms' },
                { href: 'javascript:void(0)', name: 'License' },
                { href: 'javascript:void(0)', name: 'Privacy' },
                { href: 'javascript:void(0)', name: 'About Us' },
            ]
        },
        {
            label: "Explore",
            items: [
                { href: 'javascript:void(0)', name: 'Showcase' },
                { href: 'javascript:void(0)', name: 'Roadmap' },
                { href: 'javascript:void(0)', name: 'Languages' },
                { href: 'javascript:void(0)', name: 'Blog' },
            ]
        },
        {
            label: "Company",
            items: [
                { href: 'javascript:void(0)', name: 'Partners' },
                { href: 'javascript:void(0)', name: 'Team' },
                { href: 'javascript:void(0)', name: 'Careers' },
            ],
        }
    ];

    return (
        <footer className="bg-gray-800 text-white pt-10">
            <div className="max-w-screen-xl mx-auto px-4 md:px-8">
                <div className="justify-between items-center gap-12 md:flex">
                    <div className="flex-1 max-w-lg">
                        <h3 className="text-2xl font-bold">
                            Get our beautiful newsletter straight to your inbox.
                        </h3>
                    </div>
                    <div className="flex-1 mt-6 md:mt-0">
                        <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-x-3 md:justify-end">
                            <div className="relative">
                                <svg className="w-6 h-6 text-gray-400 absolute left-3 inset-y-0 my-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                                </svg>
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    className="w-full pl-12 pr-3 py-2 text-gray-500 bg-white outline-none border focus:border-indigo-600 shadow-sm rounded-lg"
                                />
                            </div>
                            <button className="block w-auto py-3 px-4 font-medium text-sm text-center text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 active:shadow-none rounded-lg shadow">
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
                <div className="flex-1 mt-16 space-y-6 justify-between sm:flex md:space-y-0">
                    {
                        footerNavs.map((item, idx) => (
                            <ul
                                className="space-y-4 text-gray-300"
                                key={idx}
                            >
                                <h4 className="text-gray-100 font-semibold sm:pb-2">
                                    {item.label}
                                </h4>
                                {
                                    item.items.map(((el, idx) => (
                                        <li key={idx}>
                                            <a
                                                href={el.href}
                                                className="hover:text-gray-200 duration-150"
                                            >
                                                {el.name}
                                            </a>
                                        </li>
                                    )))
                                }
                            </ul>
                        ))
                    }
                </div>
                <div className="mt-10 py-10 border-t border-gray-700 items-center justify-between sm:flex">
                    <p className="text-gray-400">© 2022 Float UI Inc. All rights reserved.</p>
                    <div className="flex items-center gap-x-6 text-gray-400 mt-6">
                        <a href="javascript:void(0)">
                            <svg className="w-6 h-6 hover:text-gray-200 duration-150" fill="none" viewBox="0 0 48 48">
                                <g clipPath="url(#a)">
                                    <path fill="currentColor" d="M48 24C48 10.745 37.255 0 24 0S0 10.745 0 24c0 11.979 8.776 21.908 20.25 23.708v-16.77h-6.094V24h6.094v-5.288c0-6.014 3.583-9.337 9.065-9.337 2.625 0 5.372.469 5.372.469v5.906h-3.026c-2.981 0-3.911 1.85-3.911 3.75V24h6.656l-1.064 6.938H27.75v16.77C39.224 45.908 48 35.978 48 24z" />
                                </g>
                                <defs>
                                    <clipPath id="a">
                                        <path fill="#fff" d="M0 0h48v48H0z" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                        <a href="javascript:void(0)">
                            <svg className="w-6 h-6 hover:text-gray-200 duration-150" fill="none" viewBox="0 0 48 48">
                                <g clipPath="url(#clip0_17_80)">
                                    <path fill="currentColor" d="M15.1 43.5c18.11 0 28.017-15.006 28.017-28.016 0-.422-.01-.853-.029-1.275A19.998 19.998 0 0048 9.11c-1.795.798-3.7 1.32-5.652 1.546a9.9 9.9 0 004.33-5.445 19.794 19.794 0 01-6.251 2.39 9.86 9.86 0 00-16.788 8.979A27.97 27.97 0 013.346 6.299 9.859 9.859 0 006.393 19.44a9.86 9.86 0 01-4.462-1.228v.122a9.844 9.844 0 007.901 9.656 9.788 9.788 0 01-4.442.169 9.867 9.867 0 009.195 6.843A19.75 19.75 0 010 39.078 27.937 27.937 0 0015.1 43.5z" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_17_80">
                                        <path fill="#fff" d="M0 0h48v48H0z" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                        <a href="javascript:void(0)">
                            <svg className="w-6 h-6 hover:text-gray-200 duration-150" fill="none" viewBox="0 0 48 48">
                                <g fill="currentColor" clipPath="url(#clip0_910_44)">
                                    <path fillRule="evenodd" d="M24 1A24.086 24.086 0 008.454 6.693 23.834 23.834 0 00.319 21.044a23.754 23.754 0 003.588 11.961 23.9 23.9 0 0015.667 8.057V26.281h-4.697v-4.7h4.697v-3.47c0-4.652 2.727-7.075 6.694-7.075 1.892 0 3.894.341 3.894.341v4.295h-2.194c-2.157 0-2.828 1.343-2.828 2.717v3.287h5.672l-1.81 4.7h-3.862v13.756a23.945 23.945 0 007.165-8.303A23.804 23.804 0 0047.682 21.044a23.892 23.892 0 00-7.126-14.351A23.94 23.94 0 0024 1zm-1.224 27.434v7.2c-2.945-1.332-5.622-3.189-7.77-5.48v-6.21h1.234c3.187 2.817 6.88 4.844 10.084 6.093zm7.973-6.19h-1.258v-2.992c0-1.051.663-1.671 1.41-1.671.757 0 1.263.62 1.263 1.671v2.992zm-6.328-2.941h-1.307v2.703c0 1.433.773 2.435 2.07 2.435 1.25 0 2.03-1.001 2.03-2.435v-2.703h-1.788zm-2.765-2.28c0-1.511.965-2.69 2.564-2.69 1.66 0 2.572 1.183 2.572 2.69v2.755h-2.767c-1.55 0-2.358-1.287-2.358-2.755zm1.483 7.964c-2.226-1.47-3.743-3.664-4.476-6.308h-2.19c.749 3.88 3.294 7.287 6.869 9.547zm4.073-8.569c-.373.44-.821.78-1.321 1.053-.426.242-.884.445-1.368.571-.518.113-.998.333-1.447.623a3.975 3.975 0 00-.65.549 4.096 4.096 0 00-1.02 1.705c-.19.44-.312.872-.375 1.317-.04.413-.068.823-.078 1.228.014.417.057.826.097 1.215.07.706.177 1.398.358 2.071.069.354.122.712.185 1.066.067.56.167 1.106.307 1.644.345 1.07.755 2.127 1.192 3.143a24.237 24.237 0 00-.293-8.053z" />
                                </g>
                                <defs>
                                    <clipPath id="clip0_910_44">
                                        <path fill="#fff" d="M0 0h48v48H0z" />
                                    </clipPath>
                                </defs>
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
};

export default Footer;
