import React from 'react';

const View = () =>{

    return ( 
        <div className="main-content">
        <section className="section">
          <div className="section-body">

            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="card-header">
                    <h4>Premium Packages</h4>
                    <div class="card-header-action">
                    <a href="/Packages/Add-packages" class="btn btn-primary">Add Premium Packages</a>
                    </div>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover" id="save-stage" style={{width:"100%"}}>
                        <thead>
                          <tr>
                          <th>Id</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Status</th>
                            <th>Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td><img alt="image" src={process.env.PUBLIC_URL + '/assets/img/users/user-5.png'} width="35" /></td>
                            <td>Ajay</td>
                            <td>100</td>
                            <td><div class="badge badge-success badge-shadow">Approved</div></td>
                            <td>
                            <div class="card-body">
                            <div class="btn-group">
                      <button class="btn btn-success dropdown-toggle" type="button" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false">
                        Options
                      </button>
                      <div class="dropdown-menu">
                        <a class="dropdown-item" href="#">View</a>
                        <a class="dropdown-item" href="/Packages/Edit-Package/1">Edit</a>
                        <a class="dropdown-item" href="#">Balance</a>
                        <a class="dropdown-item" href="#">Delete</a>
                        <a class="dropdown-item" href="#">Block</a>
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
    )};

export default View;
