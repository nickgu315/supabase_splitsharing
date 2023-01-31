import Link from "next/link"
import { BsTwitter } from 'react-icons/bs';
import { AiFillFacebook } from 'react-icons/ai';

function Footer() {
    return (
        <footer className="bg-white" >
            {/* Top Footer --Start-- */}
            <div className="max-w-[898px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-[72px] md:gap-0 border-b border_soft section_py px-[18px] md:px-0">

                <div>
                    <ul className="flex flex-col gap-6" >

                        <li className="w-auto inline-block" >
                            <a href="https://www.facebook.com/Splitsharing/" target="_blank" rel="noreferrer" className="group flex items-center gap-5 !text-[#d4d4d4]">
                                <AiFillFacebook size={25} className="group-hover:scale-[1.1] duration-100" />
                                <span className="footer_nav_link social_link !text-[#d4d4d4]">Facebook</span>
                            </a>
                        </li>
                        <li className="w-auto inline-block" >
                            <a href="mailto:hello@splitsharing.com" target="_blank" rel="noreferrer" className="group flex items-center gap-5 !text-[#d4d4d4]">

                                <svg className="group-hover:scale-[1.1] duration-100" width="25" height="25" fill="#d4d4d4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26"><path d="M25.87 5.42V4.9H.1v15.28c0 .4.4.78.78.78h24.35c.4 0 .78-.4.78-.78l-.14-14.76zm-2.98.77l-9.97 8.3-9.97-8.3H22.9zM1.52 19.4V7.1l10.88 8.94c.13.13.26.13.52.13s.4 0 .52-.13L24.32 7.1v12.3H1.52z"></path></svg>

                                <span className="footer_nav_link social_link !text-[#d4d4d4]">Contact Email</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
            {/* Top Footer --End-- */}

            {/* Bottom Footer --Start-- */}
            <div className="px-[18px] md:px-0 md:max-w-[898px] mx-auto section_py md:text-center pt-[50px]">
                <p className="paragraph_sm !text-[#d4d4d4]">2022 @ Split Sharing</p>
            </div>
            {/* Bottom Footer --End-- */}
        </footer>
    )
}

export default Footer
