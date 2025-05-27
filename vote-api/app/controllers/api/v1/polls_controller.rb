class Api::V1::PollsController < ApplicationController
  def index
    render json: Poll.all, include: :votes
  end

  def show
  poll = Poll.find(params[:id])
  render json: {
    id: poll.id,
    title: poll.title,
    options: poll.options,
    votes: poll.votes # якщо хочеш включити голоси
  }
end

  def update
    poll = Poll.find(params[:id])
    if poll.update(poll_params)
      render json: poll
    else
      render json: { error: 'Помилка оновлення' }, status: :unprocessable_entity
    end
  end

  private

  def poll_params
    params.require(:poll).permit(:title, options: [])
  end
end
