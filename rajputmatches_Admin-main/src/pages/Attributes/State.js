import React from 'react';

const State = () => 
    {

        return ( 
<>
<div className="main-content">
        <section className="section">
          <div className="section-body">

            <div className="row">
              <div className="col-6">
                <div className="card">
                  <div className="card-header">
                    <h4>All State</h4>
                  </div>
                  <div className="card-body">
                    <div className="table-responsive">
                      <table className="table table-striped table-hover" id="save-stage" style={{width:"100%"}}>
                        <thead>
                          <tr>
                          <th>Id</th>
                            <th>Name</th>
                            <th>Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td>Hindu</td>
                          <td>
                          <a href="#" class="btn btn-info mr-2">Edit</a>
                          <a href="#" class="btn btn-danger">Delete</a>
                            </td>
                          </tr>
                       

                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-12 col-md-6 col-lg-6">
                <div class="card">
                  <div class="card-header">
                    <h4>Add New State </h4>
                  </div>
                  <div class="card-body">
                    <div class="form-group">
                      <label>Name</label>
                      <input type="text" class="form-control"/>
                    </div>
                  
                  </div>
                  <div class="card-footer text-right">
                    <button class="btn btn-primary mr-1" type="submit">Submit</button>
                  </div>
                </div>
              
                </div>
            </div>
          </div>
        </section>
        </div>
        
</>
)};

export default State;
