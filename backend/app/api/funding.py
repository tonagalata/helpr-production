from fastapi import (
    APIRouter, HTTPException, Depends, status
)

from app.auth.jwt_handler import get_current_user
from app.auth.pass_validation import get_user
from app.database.models.funding import FundingRequest
from app.database.collection import (
    hub_graph
)


user_collection = hub_graph.vertex_collection('user')
project_collection = hub_graph.vertex_collection('project')
applied_funding = hub_graph.edge_collection('appliedFunding')
is_funding = hub_graph.edge_collection('isFunding')
funds_collection = hub_graph.vertex_collection('funds')

router = APIRouter(
    prefix="/fund"
)


# TODO Create Funding Node
@router.post("/project", tags=['Funding'])
async def fund_project(body: FundingRequest, apiKey: dict=Depends(get_current_user)):
    # Check project
    response_body = {}

    project = project_collection.get(body.project_id)
    if project is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with project_id: '{body.project_id}' not found"
        )
    
    # Check User
    user = user_collection.get(body.username)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"User with username: '{body.username}' not found"
        )

    # Temp funding node
    fund_node = body.dict()

    # Update user funds
    check_user = update_user_funds(user, funds=body.funding_amount)
    if not check_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Funding request exceeds available funds for user."
        )
    # Update project funds
    update_project_funds(project, funds=body.funding_amount)

    # Create funding Node
    new_fund_node = funds_collection.insert(fund_node, return_new=True)
    
    response_body['funding_node'] = new_fund_node.copy()

    project_edge = {
        "_to": project['_id'],
        "_from": new_fund_node['_id']
    }

    user_edge = {
        "_to": new_fund_node['_id'],
        "_from": user['_id']
    }

    response_body['user_edge'] = is_funding.insert(user_edge, return_new=True)
    response_body['project_edge'] = applied_funding.insert(project_edge, return_new=True)

    return response_body

def update_project_funds(project: dict, funds: float=0):
    project['funds'] = project.get('funds',0) + funds
    project_collection.update(project, silent=True)
    return None

def update_user_funds(user: dict, funds: float=0):
    if (funds > user.get('available_funds', 0)):
        return False
    
    user['available_funds'] = user.get('available_funds') - funds

    user_collection.update(user, silent=True)

    return True
