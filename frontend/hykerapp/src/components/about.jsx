import Navbar from "./navbar";
import about_logo from "../assets/about_logo.png"

export default function about(){
    return(
        <div className="min-h-screen flex flex-col bg-gradient-to-b from-white via-[#fdf2f8] to-[#fde4f2]">
            <Navbar/>
            <main className="flex-1">
                <section className="px-4 pt-16 pb-10 flex flex-col items-center text-center">
                    <p className="text-xs tracking-[0.25em] uppercase text-[#58062F]/70 mb-3">
                        Hyker. Our Story
                    </p>
                    <h1 className="text-4xl md:text-5xl font-semibold text-[#58062F] mb-4">
                        Transportation That Brings People Together
                    </h1>
                    <p className="max-w-2xl text-sm md:text-base text-[#58062F]/80 leading-relaxed">
                        At Hyker, we&apos;re reimagining ridesharing as something warm, safe, and human. Built by students, for students, Hyker helps you share rides, cut costs, and make the journey a little less lonely.
                    </p>
                </section>

                <section className="px-4 pb-16 flex justify-center">
                    <div className="max-w-xl w-full flex justify-center">
                        <img
                            src={about_logo}
                            alt="Person using a phone to request a ride"
                            className="w-full max-w-md rounded-3xl object-contain"
                        />
                    </div>
                </section>

                <section className="px-4 pb-20 flex justify-center">
                    <div className="max-w-3xl text-center">
                        <h2 className="text-3xl font-semibold text-[#58062F] mb-6">
                            Our Story
                        </h2>
                        <p className="text-sm md:text-base text-[#2b1020] leading-relaxed mb-4">
                            Transporatation is an essential need for everyone. At Hyker, we aim to simplify the way students get around by creating a safe, friendly environment where sharing a ride feels natural, and not just a transaction between two people.
                        </p>
                        <p className="text-sm md:text-base text-[#2b1020] leading-relaxed mb-4">
                            Founded by university students, we understand the importance of time, money, and safety. Hyker is designed to bring together community, collaboration, and co-existence through one simple action: sharing a ride
                        </p>
                    </div>
                </section>
                
            </main>
        </div>
    );
}