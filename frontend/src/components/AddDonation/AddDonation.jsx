import React, { useState, useEffect } from 'react'
import './AddDonation.css'
import Button from '../common/Button/Button'
import InputField from '../common/InputField/InputField';
import { useAuth } from '../../contexts/AuthContext';
import { get, post, put, remove } from '../../services/apiServices';
import { useAccount } from '../../contexts/AccountContext';
import jsPDF from 'jspdf';
import { toWords } from 'number-to-words';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns'
import { toast } from 'react-toastify'
import { add } from 'date-fns/fp';

function AddDonation() {
  const { userId } = useAuth();
  const { data } = useAccount();
  const [showAddDonationForm, setShowAddDonationForm] = useState(false);
  const [showEditDonationForm, setShowEditDonationForm] = useState(false);
  const [showFromTo, setShowFromTo] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [autoDetectTimeDate, setAutoDetectTimeDate] = useState(true);
  const [addDonationData, setAddDonationData] = useState({
    userId: userId,
    donorName: '',
    donorMobileNo: '',
    donorEmailId: '',
    donationTypeId: '',
    donationAmount: '',
    date: '',
    time: ''
  })
  const [allDonationCategoriesData, setAllDonationCategoriesData] = useState([])
  const [allDonationsData, setAllDonationsData] = useState([]);
  const [showDonationsData, setShowDonationsData] = useState([])
  const [totalDonationAmount, setTotalDonationAmount] = useState(0)
  const [filterCategory, setFilterCategory] = useState('')
  const [filterTimePeriod, setFilterTimePeriod] = useState('')
  const [filterFrom, setFilterFrom] = useState('')
  const [filterTo, setFilterTo] = useState('')
  const [reportHeading, setReportHeading] = useState('Donation Report')

  //To fetch donation categories
  const fetchDonationCategories = async () => {
    try {
      const response = await get('getDonationCategories.php', userId)
      if (response.success) {
        setAllDonationCategoriesData(response.data)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    fetchDonationCategories();
  }, [])

  //To fetch donation details
  const fetchDonations = async () => {
    try {
      const response = await get('getDonations.php', userId)
      if (response.success) {
        setAllDonationsData(response.data);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    fetchDonations();
  }, [])


  //To get filter data
  const filterData = () => {
    let filteredData = allDonationsData;

    let headingCategoryPart = '';
    let headingTimePeriodPart = '';

    if (filterCategory) {
      filteredData = filteredData.filter(
        (data) => data.donationTypeName === filterCategory
      );
      headingCategoryPart = `Category: ${filterCategory}`;
    }

    if (filterTimePeriod) {
      const now = new Date();
      if (filterTimePeriod === 'default') {
        setShowFromTo(false)
      } else if (filterTimePeriod === 'today') {
        const today = new Date();
        const dateStr = today.toISOString().split('T')[0];
        filteredData = filteredData.filter((data) => {
          const donationDate = data.date;
          return donationDate === dateStr;
        });
        setShowFromTo(false)
        headingTimePeriodPart = `Today (${format(dateStr, 'dd/MM/yyyy')})`;
      } else if (filterTimePeriod === 'thisweek') {
        const startOfWeek = new Date();
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date();
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        filteredData = filteredData.filter((data) => {
          const donationDate = new Date(data.date);
          return donationDate >= startOfWeek && donationDate <= endOfWeek;
        });
        setShowFromTo(false)
        headingTimePeriodPart = `Weekly (${format(startOfWeek, 'dd/MM/yyyy')} - ${format(endOfWeek, 'dd/MM/yyyy')})`;
      } else if (filterTimePeriod === 'thismonth') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        filteredData = filteredData.filter((data) => {
          const donationDate = new Date(data.date);
          return donationDate >= startOfMonth && donationDate <= endOfMonth;
        });
        setShowFromTo(false)
        headingTimePeriodPart = `Monthly (${format(startOfMonth, 'dd/MM/yyyy')} - ${format(endOfMonth, 'dd/MM/yyyy')})`;
      } else if (filterTimePeriod === 'thisyear') {
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const endOfYear = new Date(now.getFullYear(), 11, 31);

        filteredData = filteredData.filter((data) => {
          const donationDate = new Date(data.date);
          return donationDate >= startOfYear && donationDate <= endOfYear;
        });
        setShowFromTo(false)
        headingTimePeriodPart = `Yearly (${format(startOfYear, 'dd/MM/yyyy')} - ${format(endOfYear, 'dd/MM/yyyy')})`;
      } else if (filterTimePeriod === 'lastyear') {
        const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
        const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);

        filteredData = filteredData.filter((data) => {
          const donationDate = new Date(data.date);
          return donationDate >= startOfLastYear && donationDate <= endOfLastYear;
        });
        setShowFromTo(false)
        headingTimePeriodPart = `Last Yearly (${format(startOfLastYear, 'dd/MM/yyyy')} - ${format(endOfLastYear, 'dd/MM/yyyy')})`;
      } else if (filterTimePeriod === 'custom') {
        setShowFromTo(true)
      }
    }

    if (filterFrom || filterTo) {
      if (filterFrom && filterTo) {
        const fromDate = new Date(filterFrom);
        const toDate = new Date(filterTo);

        filteredData = filteredData.filter((data) => {
          const donationDate = new Date(data.date);
          return donationDate >= fromDate && donationDate <= toDate;
        });

        headingTimePeriodPart = `Time Period: From (${format(fromDate, 'dd/MM/yyyy')} - To ${format(toDate, 'dd/MM/yyyy')})`;
      } else if (filterFrom) {
        const fromDate = new Date(filterFrom);

        filteredData = filteredData.filter((data) => {
          const donationDate = new Date(data.date);
          return donationDate >= fromDate;
        });

        headingTimePeriodPart = `Time Period: From ${format(fromDate, 'dd/MM/yyyy')}) - To ${format(new Date(), 'dd/MM/yyyy')}`;
      } else if (filterTo) {
        const toDate = new Date(filterTo);

        filteredData = filteredData.filter((data) => {
          const donationDate = new Date(data.date);
          return donationDate <= toDate;
        });

        headingTimePeriodPart = `Time Period: Until ${format(toDate, 'dd/MM/yyyy')})`;
      }
    }

    const finalReportHeading = [
      'Donation Report',
      headingCategoryPart,
      headingTimePeriodPart,
    ].filter(Boolean).join(' - ');

    setReportHeading(finalReportHeading);

    let sum = 0;
    filteredData.forEach((data) => {
      const amount = parseFloat(data.donationAmount);
      sum += amount;
    });

    setTotalDonationAmount(sum);

    setShowDonationsData(filteredData);
  };

  useEffect(() => {
    filterData();
  }, [filterCategory, filterTimePeriod, allDonationsData, filterFrom, filterTo]);


  //To show add donation form
  const handleAddDonation = () => {
    setShowAddDonationForm(true);
  }

  //To close add donation form
  const closeAddDonationForm = () => {
    setShowAddDonationForm(false);
    setShowEditDonationForm(false);
  }

  //To show edit donation details
  const handleEditDonation = (data2) => {

    setAddDonationData({
      userId: userId,
      donationReceiptNo: data2.donationReceiptNo,
      donorName: data2.donorName,
      donorMobileNo: data2.donorMobileNo,
      donorEmailId: data2.donorEmailId,
      donationTypeId: data2.donationTypeId,
      donationTypeName: data2.donationTypeName,
      donationAmount: data2.donationAmount,
      date: data2.date,
      time: data2.time
    })
    setShowEditDonationForm(true);
  }

  //To handle add donation form
  const handleAddDonationForm = async (e) => {
    e.preventDefault();

    let finalAddDonationData;
    if (autoDetectTimeDate) {
      finalAddDonationData = {
        ...addDonationData,
        donationReceiptNo: `d${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-GB')
      }
    } else {
      finalAddDonationData = {
        ...addDonationData,
        donationReceiptNo: `d${Date.now()}`
      }
    }

    try {
      const response = await post('addDonations.php', finalAddDonationData)
      if (response.success) {
        toast.success('Donation added successfully')
        fetchDonations();
        setShowAddDonationForm(false)
        setAddDonationData({
          userId: userId,
          donationReceiptNo: '',
          donorName: '',
          donorMobileNo: '',
          donorEmailId: '',
          donationTypeId: '',
          donationAmount: '',
          date: '',
          time: ''
        })
      } else {
        toast.error('Failed to add donation: ' + response.message);
      }
    } catch (error) {
      toast.error(error.message)
    }
  }


  //To handle edit donation form
  const handleEditDonatioForm = async (e) => {
    e.preventDefault();

    try {
      const response = await put('editDonations.php', addDonationData, userId)
      if (response.success) {
        toast.success('Donation updated successfully.')
        setShowEditDonationForm(false);
        fetchDonations();
        setAddDonationData({
          userId: userId,
          donationReceiptNo: '',
          donorName: '',
          donorMobileNo: '',
          donorEmailId: '',
          donationTypeId: '',
          donationAmount: '',
          date: '',
          time: ''
        })
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //To handle remove donation
  const handleRemoveDonation = async (dataId) => {
    try {
      const response = await remove('deleteDonations.php', userId, dataId)
      if (response.success) {
        toast.success('Donation deleted successfully.')
        fetchDonations();
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  //To generate donation receipt
  const generateReceipt = (donationData, organizationData, action = "") => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(organizationData.organizationName, pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.setFont('Helvetica', 'normal');
    doc.text(`Address: ${organizationData.address}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Mobile: ${organizationData.mobileNo} | Email: ${organizationData.emailId}`, pageWidth / 2, 40, { align: 'center' });

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Donation Receipt', pageWidth / 2, 50, { align: 'center' });

    const tableBody = [
      ['Receipt No:', donationData.donationReceiptNo],
      ['Date:', format(donationData.date, 'dd/MM/yyyy')],
      ['Time:', formatTimeToAMPM(donationData.time)],
      ['Donor Name:', donationData.donorName],
      ['Donor Mobile No:', donationData.donorMobileNo],
      ['Donor Email ID:', donationData.donorEmailId],
      ['Donation Type:', donationData.donationTypeName],
      ['Donation Amount:', `Rs.${donationData.donationAmount}`],
      ['Amount in Words:', `${toWords(donationData.donationAmount)} rupees only`],
    ];

    autoTable(doc, {
      startY: 60,
      head: [['Details', 'Information']],
      body: tableBody,
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255], fontStyle: 'bold' },
      bodyStyles: { fontSize: 12, textColor: [0, 0, 0] },
      margin: { left: 20, right: 20 },
      columnStyles: {
        0: { cellWidth: 50, fontStyle: 'bold' },
        1: { cellWidth: 130 },
      },
    });

    const thankYouY = doc.lastAutoTable.finalY + 20;
    doc.setFont('Helvetica', 'italic');
    doc.setFontSize(11);
    doc.text(
      `Thank you, ${donationData.donorName}, for your generous donation of Rs.${donationData.donationAmount}.`,
      20,
      thankYouY,
      { maxWidth: pageWidth - 40 }
    );

    const footerY = 280;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('This is a computer-generated receipt and does not require a signature.', pageWidth / 2, footerY, {
      align: 'center',
    });


    if (action === 'download') {
      doc.save(`Donation_Receipt_${donationData.donationReceiptNo}.pdf`);
      toast.success('Receipt downloaded successfully.')
    } else if (action === 'print') {
      doc.autoPrint();
      window.open(doc.output('bloburl'));
      toast.success('Receipt printed successfully.')
    }

  };

  //To generate donation report
  const generateReport = (donationData, organizationData, action = "") => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(organizationData.organizationName, pageWidth / 2, 20, { align: 'center' });

    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(12);
    doc.text(`Address: ${organizationData.address}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Mobile: ${organizationData.mobileNo} | Email: ${organizationData.emailId}`, pageWidth / 2, 40, { align: 'center' });

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(reportHeading, pageWidth / 2, 50, { align: 'center' });


    const tableData = donationData.map((donation, index) => [
      index + 1,
      donation.donationReceiptNo,
      format(new Date(donation.date), 'dd/MM/yyyy'),
      formatTimeToAMPM(donation.time),
      donation.donorName,
      donation.donorMobileNo,
      donation.donorEmailId,
      donation.donationTypeName,
      `Rs.${donation.donationAmount}`
    ]);

    autoTable(doc, {
      startY: 60,
      head: [
        [
          'No.',
          'Receipt No',
          'Date',
          'Time',
          'Donor Name',
          'Donor Mobile No',
          'Donor Email ID',
          'Donation Type',
          'Donation Amount'
        ],
      ],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255], textColor: [255] },
    });

    const totalAmount = donationData.reduce((sum, item) => sum + parseFloat(item.donationAmount), 0);

    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Total Donation Amount: Rs. ${totalAmount}`, pageWidth / 2, doc.lastAutoTable.finalY + 10, { align: 'center' });

    const footerY = 200;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    const now = new Date();
    const time = new Date().toLocaleTimeString('en-GB')
    const formattedDateTime = `${format(now, 'dd/MM/yyyy')} ${formatTimeToAMPM(time)}`;
    doc.text(`Downloaded on: ${formattedDateTime}`, pageWidth / 2, footerY, { align: 'center' });


    if (action === 'download') {
      doc.save(`donation_report_${Date.now()}.pdf`);
      toast.success('Report downloaded successfully.')
    } else if (action === 'print') {
      doc.autoPrint();
      window.open(doc.output('bloburl'));
      toast.success('Report printed successfully.')
    }
  }

  //To handle reset button
  const handleResetFilter = () => {
    setFilterCategory('')
    setFilterTimePeriod('')
    setFilterFrom('')
    setFilterTo('')
    setSearchInput('');
  }

  //To convert desire date and time format
  const formatTimeToAMPM = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  }

  //To handle search donation
  const handleSearch = (value) => {
    if (value === "") {
      setShowDonationsData(allDonationsData);
    } else {
      const filteredData = allDonationsData.filter((data) =>
        data.donationReceiptNo.toLowerCase().startsWith(value.toLowerCase())
      );
      setShowDonationsData(filteredData);
    }
  };

  useEffect(() => {
    handleSearch(searchInput);
  }, [searchInput])

  return (
    <div className='adddonation-main-container'>
      <div className="adddonation-heading">
        <p>Donations</p>
        <Button icon={<i className="fa-solid fa-plus"></i>} onClick={handleAddDonation} />
      </div>
      <div className="adddonation-filter-container">
        <InputField type='text' value={searchInput} onChange={(e) => { setSearchInput(e.target.value); handleSearch(e.target.value) }} placeholder='Seach Donation Receipt No.' />
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
          <option value="">--Category--</option>
          {allDonationCategoriesData.map((data, index) => (
            <option key={index} value={data.donationTypeName}>
              {data.donationTypeName}
            </option>
          ))}
        </select>
        <select value={filterTimePeriod} onChange={(e) => setFilterTimePeriod(e.target.value)}>
          <option value="default">--Time Period--</option>
          <option value='today'>Today</option>
          <option value='thisweek'>This Week</option>
          <option value='thismonth'>This Month</option>
          <option value='thisyear'>This Year</option>
          <option value='lastyear'>Last Year</option>
          <option value='custom'>Custom</option>
        </select>
        {showFromTo &&
          <div>
            <InputField type='date' value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} />
            <InputField type='date' value={filterTo} onChange={(e) => setFilterTo(e.target.value)} />
          </div>
        }
        <Button text='Reset' onClick={handleResetFilter} />
      </div>
      <div className="adddonation-content">
        <table>
          <thead>
            <tr>
              <th>No.</th>
              <th>Donation Receipt No</th>
              <th>Donor Name</th>
              <th>Mobile No</th>
              <th>Donation Type</th>
              <th>Donation Amount</th>
              <th>Date</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {showDonationsData.sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`)).map((data2, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{data2.donationReceiptNo}</td>
                <td>{data2.donorName}</td>
                <td>{data2.donorMobileNo}</td>
                <td>{data2.donationTypeName}</td>
                <td>{data2.donationAmount}</td>
                <td>{format(data2.date, 'dd/MM/yyyy')}</td>
                <td>{formatTimeToAMPM(data2.time)}</td>
                <td>
                  <div className='table-actionicons'>
                    <i className="fa-solid fa-download" onClick={() => generateReceipt(data2, data, 'download')}></i>
                    <i className="fa-solid fa-print" onClick={() => generateReceipt(data2, data, 'print')}></i>
                    <i className="fa-solid fa-pen-to-square" onClick={() => handleEditDonation(data2)}></i>
                    <i className="fa-solid fa-trash" onClick={() => handleRemoveDonation(data2.donationReceiptNo)}></i>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan='5' >Total</td>
              <td >{totalDonationAmount}</td>
            </tr>
          </tbody>
        </table>
        {!searchInput &&
          <div className='table-icons-container'>
            <Button text='Download' onClick={() => generateReport(showDonationsData, data, 'download')} />
            <Button text='Print' onClick={() => generateReport(showDonationsData, data, 'print')} />
          </div>
        }
      </div>

      {(showAddDonationForm || showEditDonationForm) &&
        <div className='adddonation-form-container'>
          <div className="adddonation-form-content">
            <div className="adddonation-form-heading">
              <p>{showEditDonationForm ? 'Edit Donation Details' : 'Add Donation Details'}</p>
              <i className='fa solid fa-xmark' onClick={closeAddDonationForm}></i>
            </div>
            <div className="adddonation-form-inputs">
              <form onSubmit={showEditDonationForm ? handleEditDonatioForm : handleAddDonationForm} className='adddonation-form'>
                <InputField type='text' value={addDonationData.donorName} onChange={(e) => setAddDonationData({ ...addDonationData, donorName: e.target.value })} placeholder='Donor Name' />
                <InputField type='number' value={addDonationData.donorMobileNo} onChange={(e) => setAddDonationData({ ...addDonationData, donorMobileNo: e.target.value })} placeholder='Donor Mobile No.' />
                <InputField type='email' value={addDonationData.donorEmailId} onChange={(e) => setAddDonationData({ ...addDonationData, donorEmailId: e.target.value })} placeholder='Donor Email Id' />
                <select id="donation-type" value={addDonationData.donationTypeId} onChange={(e) => setAddDonationData({ ...addDonationData, donationTypeId: e.target.value })} >
                  <option value="">--Donation Type--</option>
                  {allDonationCategoriesData.map((option, index) => (
                    <option key={index} value={option.donationTypeId}>
                      {option.donationTypeName}
                    </option>
                  ))}
                </select>
                <InputField type='number' value={addDonationData.donationAmount} onChange={(e) => setAddDonationData({ ...addDonationData, donationAmount: e.target.value })} placeholder='Donation Amount' />
                <div className="autoselect-checkbox-container">
                  <input type='checkbox' checked={autoDetectTimeDate} onChange={(e) => setAutoDetectTimeDate(e.target.checked)} />
                  <label>Auto Select Date & Time</label>
                </div>

                {!autoDetectTimeDate &&
                  <div className='datetime-container'>
                    <InputField type='date' value={addDonationData.date} onChange={(e) => setAddDonationData({ ...addDonationData, date: e.target.value })} />
                    <InputField type='time' value={addDonationData.time} onChange={(e) => setAddDonationData({ ...addDonationData, time: e.target.value })} />
                  </div>}
                <Button text='Submit' type='submit' />
              </form>
            </div>
          </div>
        </div>}
    </div>
  )
}

export default AddDonation