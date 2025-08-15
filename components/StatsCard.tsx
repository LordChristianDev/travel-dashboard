import { calculateTrendPercentage, cn } from "~/lib/utils";

const StatsCard = ({
	headerTitle,
	total,
	lastMonthCount,
	currentMonthCount
}: StatsCard
) => {
	const { trend, percentage } = calculateTrendPercentage(currentMonthCount, lastMonthCount);
	const isDecrement = trend === 'decrement';

	return (
		<article className="stats-card">
			<h3 className="text-base font-medium">
				{headerTitle}
			</h3>

			<div className="content">
				{/* Content */}
				<div className="flex flex-col gap-4">
					<h2 className="text-4xl font-semibold">{total}</h2>
					<div className="flex items-center gap-2">
						<figure className="flex items-center gap-1">
							<img
								src={`/assets/icons/${isDecrement ? 'arrow-down-red.svg' : 'arrow-up-green.svg'}`}
								alt="arrow"
							/>

							<figcaption className={cn(
								'text-sm font-medium',
								isDecrement ? 'text-red-500' : 'text-success-500'
							)}>
								{Math.round(percentage)}%
							</figcaption>
						</figure>

						<p className="text-sm font-medium text-gray-100 truncate">vs last month</p>
					</div>
				</div>

				{/* Trend Graph */}
				<img
					src={`/assets/icons/${isDecrement ? 'decrement.svg' : 'increment.svg'}`}
					alt="trend-graph"
					className="w-full xl:w-32 h-full md:h-32"
				/>
			</div>

		</article>
	)
}

export default StatsCard;
