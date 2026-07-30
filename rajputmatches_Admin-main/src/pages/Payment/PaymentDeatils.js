import React from 'react';

const PaymentDeatils = () => 
    {

        return ( 
<>
<div className="main-content">
        <section className="section">
          <div className="section-body">

            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h4>Payment Details</h4>
                    {/* <div class="card-header-action">
                    <a href="#" class="btn btn-primary">Add Members</a>
                    </div> */}
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover" id="save-stage" style={{width:"100%"}}>
                        <thead>
                          <tr>
                          <th>Id</th>
                            <th>Member Name</th>
                            <th>Package</th>
                            <th>Payment Method</th>
                            <th>Amount</th>
                            <th>Payment Status</th>
                            <th>Payment Code</th>
                            <th>Purchase Date</th>
                            <th>Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Test</td>
                            <td>Test</td>
                            <td>Online</td>
                            <td>100</td>
                            <td>Success</td>
                            <td>10022</td>
                            <td>12/02/24</td>
                            <td>
                            <div class="card-body">
                            <div class="btn-group">
                      <button class="btn btn-success dropdown-toggle" type="button" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        Options
                      </button>
                      <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">View</a>
                        <a class="dropdown-item" href="#">Edit</a>
                        {/* <a class="dropdown-item" href="#">Balance</a> */}
                        <a class="dropdown-item" href="#">Delete</a>
                        {/* <a class="dropdown-item" href="#">Block</a> */}
                      </div>
                    </div>
                    </div>
                            </td>
                          </tr>
                        </tbody>
                        
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>
</>
)};

export default PaymentDeatils;
