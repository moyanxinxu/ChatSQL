import { WeatherKit } from "@/components/tools/Weather";

const Tool = ({ tool_name, tool_content }) => {
    if (tool_name === 'get_weather') {
        return <WeatherKit content={tool_content} />
    }
};

export { Tool };