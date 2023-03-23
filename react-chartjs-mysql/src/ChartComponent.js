import React, { useEffect, useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js'
import { Line } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
  );
  
const ChartComponent = () => {


    const [chartData, setChartData] = useState({
        labels: [],
        datasets: []
    });

    const [isPcfIncomeVisible, setIsPcfIncomeVisible] = useState(true);

    const [isPcfShareVisible, setIsPcfShareVisible] = useState(true);

    const [droCode, setDroCode] = useState("");

    const [inputError, setInputError] = useState(null);

    const fetchData = async () => {
        if (!droCode) {
            setInputError("DRO Code is required");
            return;
        }

        try {
            const response = await fetch(`http://localhost:443/data?dro_code=${droCode}`);
            if (!response.ok) {
                throw new Error(`HTTP error: ${response.status}`);
            }

            const data = await response.json()

            console.log('Data: ', data);

            const pcfData = data[0]['pcf_income'];
            const pcfShare = data[0]['pcf_share'];

            if (pcfData === undefined) {
                console.error("pcf_income is undefined");
                return;
            }

            let pcfDataeach = Object.values(pcfData)
            let pcfDataeachlabels = Object.keys(pcfData)
            let pcfShareeach = Object.values(pcfShare);

            setChartData({
                labels: pcfDataeachlabels,
                datasets: [
                    {   
                        label: 'pcf income',
                        data: pcfDataeach,
                        backgroundColor: 'rgba(75, 192, 192)',
                        borderColor: 'rgba(75, 192, 192)',
                        borderWidth: 1,
                        tension: 0.2,
                    },
                    {
                        label: 'pcf share',
                        data: pcfShareeach,
                        backgroundColor: 'rgba(73, 137, 202, 0.8)',
                        borderColor: 'rgba(73, 137, 202, 0.8)',
                        borderWidth: 1,
                        tension: 0.2,
                    }
                ],
            });
    } catch (error) {
        console.error("error");
    }};

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        setChartData((prevState) => ({
            ...prevState,
            datasets: prevState.datasets.map((dataset) => ({
                ...dataset,
                hidden:
                    dataset.label === "pcf income" ? !isPcfIncomeVisible : !isPcfShareVisible,
            })),
        }));
    }, [isPcfIncomeVisible, isPcfShareVisible]);

    const options = {

        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'osjfd',
            }
        }
    }

    const handlePcfIncomeToggle = () => {
        setIsPcfIncomeVisible((prevState) => !prevState);
    };

    const handlePcfShareToggle = () => {
        setIsPcfShareVisible((prevState) => !prevState)
    };

    const handleDroCodeChange = (e) => {
        setDroCode(e.target.value);
        setInputError(null);
    };

    return (
        <div>
            <div>
                <label htmlFor="droCode">Enter DRO Code: </label>
                <input
                    type="text"
                    id="droCode"
                    value={droCode}
                    onChange={handleDroCodeChange}
                />
            <button onClick={fetchData}>Fetch Data</button>
            </div>
            {inputError && <p style={{ color: "red" }}>{inputError}</p>}
            <button onClick={handlePcfIncomeToggle}>Toggle PCF Income</button>
            <button onClick={handlePcfShareToggle}>Toggle PCF Share</button>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default ChartComponent