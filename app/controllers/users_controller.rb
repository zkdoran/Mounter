class UsersController < ApplicationController
  def create
    @user = User.new(user_params)

    if @user.save
      render 'api/users/create', status: :created
    else
      render json: { success: false }, status: :bad_request
    end

    private

    def user_params
      params.require(:user).permit(:username, :password)
    end
  end
end
