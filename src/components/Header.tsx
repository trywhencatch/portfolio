import { HoverModal } from './HoverModal';
import { GitHubCalendar } from 'react-github-calendar';

export function Header() {
    return (
        <header className="mb-[32px] flex flex-col md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
                <span className="font-serif text-[32px] italic font-bold text-[#0ea5e9] mb-[10px] tracking-tight">
                    Prasan Mishra
                </span>
                <div className="font-mono text-base text-slate-900 flex flex-wrap gap-x-6 gap-y-2 mb-[16px]">
                    <span>React</span>
                    <span>Node.js</span>
                    <span>Tailwind CSS</span>
                    <span>TypeScript</span>
                </div>
                <p className="font-inter text-md text-slate-600 max-w-2xl leading-relaxed mb-[10px] ">
                    I am a software engineer based in Gurugram, India, and currently working as an
                    SDE at Internshala. I love the craft behind making user interfaces look
                    beautiful, feel great to use, and run blazing fast.
                </p>
                <div className="text-md text-slate-600 max-w-2xl leading-relaxed mb-[10px]">
                    Reach out to me at{' '} 
                    <a
                        href="https://x.com/prasan_mishra"
                        target="_blank"
                        rel="noreferrer"
                        className="text-slate-900 transition-colors"
                    >
                        Twitter
                    </a>{' '}
                    and check my work at{' '}
                    <HoverModal
                        content={
                            <a className="p-2" href={"https://github.com/trywhencatch"} >
                                <span className='mb-[10px] font-medium flex '>
                                    Github Contributions
                                </span>
                                <GitHubCalendar
                                    username="trywhencatch"
                                    colorScheme="light"
                                    fontSize={12}
                                    blockSize={6}
                                    blockMargin={3}
                                />
                            </a>
                        }
                    >
                        <span className="text-[#0ea5e9] cursor-pointer underline-offset-4  px-1 rounded transition-colors">
                            GitHub
                        </span>
                    </HoverModal>
                    .
                </div>
            </div>
        </header>
    );
}
