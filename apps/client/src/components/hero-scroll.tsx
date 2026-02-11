import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroScrollDemo() {
	return (
		<div className="flex flex-col overflow-hidden">
			<ContainerScroll
				titleComponent={
					<>
						<h1 className="text-3xl font-semibold text-black dark:text-white">
							Automated <br />
							<span className="text-4xl md:text-[5rem] font-bold mt-1 leading-none">
								Trading workflows
							</span>
						</h1>
					</>
				}
			>
				<img
					src="./assets/landing/workflow-light.png"
					alt="hero"
					height={720}
					width={1400}
					className="mx-auto rounded-2xl object-cover h-full object-center"
					draggable={false}
				/>
			</ContainerScroll>
		</div>
	);
}
